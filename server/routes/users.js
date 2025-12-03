import express from "express";
import { body, checkSchema, matchedData } from "express-validator";
import { handleValidationErrors } from "../middleware/handleValidationErrors.js";
const router = express.Router();

import { authenticateJWT, authenticateLocal } from "../middleware/auth.js";
import {
  createUserValidationSchema,
  loginUserValidationSchema,
} from "../schemas/validationSchemas.js";
import {
  loginController,
  registerController,
} from "../controllers/userController.js";
import {
  createAccessToken,
  createRefreshToken,
  saveRefreshToken,
  verifyRefreshToken,
} from "../utils/tokenHelpers.js";
import { User } from "../models/user.js";
import { RefreshToken } from "../models/refreshToken.js";
import { setRefreshTokenCookie } from "../utils/cookieHelpers.js";

router.get("/me", authenticateJWT, (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      username: req.user.username,
    },
  });
});

router.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.cookies.Authorization;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const checkRefreshToken = verifyRefreshToken(refreshToken);

    if (!checkRefreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refreshToken" });
    }

    const userId = checkRefreshToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newAccessToken = createAccessToken();
    const newRefreshToken = createRefreshToken();
    await RefreshToken.deleteOne({ _id: checkRefreshToken._id });
    await saveRefreshToken(newRefreshToken, userId);

    setRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/register",
  checkSchema(createUserValidationSchema),
  handleValidationErrors,
  registerController
);

router.post(
  "/login",
  checkSchema(loginUserValidationSchema),
  handleValidationErrors,
  authenticateLocal,
  loginController
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
