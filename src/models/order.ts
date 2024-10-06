import mongoose from "mongoose";
import { requiredString } from "./user";
import { requiredNumber } from "./restaurant";

const orderSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deliveryDetails: {
    email: requiredString,
    name: requiredString,
    addressLine1: requiredString,
    city: requiredString,
  },
  cartItems: [
    {
      menuItemId: requiredString,
      quantity: requiredNumber,
      name: requiredString,
    },
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["placed", "paid", "inProgress", "outForDelivery", "delivered"],
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
