import mongoose, { InferSchemaType } from "mongoose";
import { requiredString } from "./user";

const requiredNumber = {
  type: Number,
  required: true,
};

const menuItemSchema = new mongoose.Schema({
  name: requiredString,
  price: requiredNumber,
});

export type MenuItemType = InferSchemaType<typeof menuItemSchema>;

const restaurantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  restaurantName: requiredString,
  country: requiredString,
  city: requiredString,
  deliveryPrice: requiredNumber,
  estimatedDeliveryTime: requiredNumber,
  cuisines: [requiredString],
  menuItems: [menuItemSchema],
  imageUrl: requiredString,
  lastUpdated: { type: Date, required: true },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
