import express from "express";
import { body, checkSchema, matchedData } from "express-validator";
import { handleValidationErrors } from "../middleware/handleValidationErrors.js";
const router = express.Router();
import { hashPassword } from "../utils/helpers.js";
import { User } from "../models/user.js";
import passport from "passport";
import { authenticateLocal } from "../middleware/auth.js";

router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      authenticated: true,
      user: { id: req.user._id },
    });
  }
  return res.status(200).json({ authenticated: false, user: null });
});
router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid email"),
  body("username")
    .isString()
    .isLength({ min: 4, max: 20 })
    .withMessage(
      "Username must be at least 4 characters with a max of 20 characters."
    ),
  body("password").isLength({ min: 3 }).withMessage("Password too short"),
  handleValidationErrors,
  async (req, res, next) => {
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
  }
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
  authenticateLocal,
  (req, res) => {
    return res
      .status(200)
      .json({ success: true, message: "Logged in succesfully" });
    //   return res.status(200).json({
    //   success: true,
    //   user: { id: req.user._id, username: req.user.username },
    // });
  }
);

router.post("/logout", (req, res, next) => {
  if (!req.user) return res.sendStatus(401);

  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.status(200).json("Logged out successfully");
  });
});

export default router;
