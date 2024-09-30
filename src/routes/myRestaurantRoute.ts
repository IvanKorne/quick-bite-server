import express from "express";
import multer from "multer";
import { createRestaurant } from "../controllers/myRestaurantController";
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

router.post(
  "/",
  validateRestaurantRequest as any,
  jwtCheck,
  jwtParse as any,
  upload.single("imageFile"),
  createRestaurant as any
);

export default router;
