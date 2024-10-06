import express from "express";
import { param } from "express-validator";
import {
  searchRestaurants,
  getRestaurantDetails,
} from "../controllers/RestaurantController";

const router = express.Router();

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City must be a string"),
  searchRestaurants as any
);

router.get(
  "/:restaurantId",
  param("restaurantId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("RestaurantId must be a string"),
  getRestaurantDetails as any
);

export default router;
