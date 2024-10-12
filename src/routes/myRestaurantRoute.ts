import express from "express";
import multer from "multer";
import {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  updateOrderStatus,
  getRestaurantOrders,
} from "../controllers/myRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateRestaurantRequest } from "../middleware/validation";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.get("/orders", jwtCheck, jwtParse as any, getRestaurantOrders as any);

router.get("/", jwtCheck, jwtParse as any, getRestaurant as any);

router.post(
  "/",
  upload.single("imageFile"),
  validateRestaurantRequest as any,
  jwtCheck,
  jwtParse as any,
  createRestaurant as any
);

router.patch(
  "/order/:orderId/status",
  jwtCheck,
  jwtParse as any,
  updateOrderStatus as any
);
router.put(
  "/",
  upload.single("imageFile"),
  validateRestaurantRequest as any,
  jwtCheck,
  jwtParse as any,
  updateRestaurant as any
);

export default router;
