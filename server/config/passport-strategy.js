import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../models/user.js";
import { comparePassword } from "../utils/helpers.js";

passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const findUser = await User.findOne({ email });
      if (!findUser) return done(null, false, { message: "Invalid email" });
      const checkPassword = await comparePassword(password, findUser.password);
      if (!checkPassword) {
        return done(null, false, { message: "Invalid password" });
      }
      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.findById(id);
    if (!findUser) return done(null, false);

    done(null, findUser);
  } catch (error) {
    done(error);
  }
});
