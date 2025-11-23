import passport from "passport";

export const authenticateLocal = (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info?.message || "Authorization failed" });

      //   return res.status(200).json({
      //   success: false,
      //   message: info?.message || "Invalid credentials",
      // });
    }

    req.login(user, (error) => {
      if (error) {
        return next(error);
      }

      next();
    });
  })(req, res, next);
};
