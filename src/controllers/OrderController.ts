import { Response, Request } from "express";
import Stripe from "stripe";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";

const STRIPE_KEY = new Stripe(process.env.STRIPE_API_KEY!);
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const CLIENT_URL = process.env.CLIENT_URL!;

type CheckoutSession = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};

const createLineItems = (
  checkoutSessionRequest: CheckoutSession,
  menuItems: MenuItemType[]
) => {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );

    if (!menuItem) {
      throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
    }

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "cad",
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };
    return lineItem;
  });

  return lineItems;
};

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string
) => {
  const sessionData = await STRIPE_KEY.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice,
            currency: "cad",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId,
      restaurantId,
    },
    success_url: `${CLIENT_URL}/order-status?success=true`,
    cancel_url: `${CLIENT_URL}/details/${restaurantId}?cancelled=true`,
  });
  return sessionData;
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("restaurant")
      .populate("user");
    if (!orders) {
      return res.sendStatus(404);
    }

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error getting order details" });
  }
};

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;

  try {
    const signature = req.headers["stripe-signature"];
    event = STRIPE_KEY.webhooks.constructEvent(
      req.body,
      signature!,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log(error);
    return res.status(400).send("Webhook error");
  }

  if (event.type === "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId);

    if (!order) {
      return res.sendStatus(404);
    }

    order.totalAmount = event.data.object.amount_total;
    order.status = "paid";

    await order.save();
  }

  res.status(200).send();
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSession = req.body;
    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      return res.sendStatus(404);
    }

    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userId,
      status: "placed",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
    });

    const lineItems = createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );

    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restaurant.deliveryPrice,
      restaurant._id.toString()
    );

    if (!session.url) {
      return res
        .status(500)
        .json({ message: "Error creating checkout session" });
    }

    await newOrder.save();
    res.json({ url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating checkout session" });
  }
};
