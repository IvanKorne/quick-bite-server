import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import {
  createCheckoutSession,
  stripeWebhookHandler,
  getOrders,
} from "../controllers/OrderController";

const router = express.Router();

router.get("/", jwtCheck, jwtParse as any, getOrders as any);

router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse as any,
  createCheckoutSession as any
);

router.post("/checkout/webhook", stripeWebhookHandler as any);

export default router;
