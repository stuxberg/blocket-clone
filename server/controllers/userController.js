import { hashPassword } from "../utils/helpers.js";
import { User } from "../models/user.js";
import { matchedData } from "express-validator";

export const registerController = async (req, res, next) => {
  const data = matchedData(req);
  try {
    data.password = await hashPassword(data.password);
    const userObject = new User(data);
    const savedUser = await userObject.save();
    return res.status(201).json({ success: true, savedUser });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    error.status = 400;
    next(error);
  }
};

export const loginController = (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "Logged in succesfully" });
  //   return res.status(200).json({
  //   success: true,
  //   user: { id: req.user._id, username: req.user.username },
  // });
};
