import { setRefreshTokenCookie } from "../utils/cookieHelpers.js";
import passport from "passport";

export const authenticateLocal = (req, res, next) => {
  passport.authenticate("local", { session: false }, (error, user, info) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.status(400).json({
        success: false,
        message: info?.message || "Invalid credentials",
      });
    }

    const { accessToken, refreshToken } = info;

    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      accessToken: accessToken,
      success: true,
      message: "Logged in succesfully",
    });
  })(req, res, next);
};

export const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user, info) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "Invalid or expired token",
      });
    }

    // Set user on request object
    req.user = user;
    return next();
  })(req, res, next);
};
