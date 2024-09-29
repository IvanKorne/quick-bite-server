import mongoose from "mongoose";

const requiredString = {
  type: String,
  required: true,
};

const userSchema = new mongoose.Schema({
  auth0Id: requiredString,
  email: requiredString,
  name: String,
  addressLine1: String,
  city: String,
  country: String,
});

const User = mongoose.model("User", userSchema);

export default User;
