import express from "express";
import {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
} from "../controllers/myRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateRestaurantRequest } from "../middleware/validation";
import { param } from "express-validator";
import { searchRestaurants } from "../controllers/RestaurantController";

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

export default router;
