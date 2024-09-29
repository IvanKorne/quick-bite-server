import { Response, Request } from "express";
import User from "../models/user";

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      return res.sendStatus(404);
    }

    res.json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      return res.status(200).send();
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, city, addressLine1, country } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.sendStatus(404);
    }

    user.name = name;
    user.city = city;
    user.addressLine1 = addressLine1;
    user.country = country;

    await user.save();

    res.status(200).send({ message: "Successfully updated user" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
};
