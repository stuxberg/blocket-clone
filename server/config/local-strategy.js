import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../models/user.js";
import { comparePassword } from "../utils/helpers.js";
import {
  createAccessToken,
  createRefreshToken,
  saveRefreshToken,
} from "../utils/tokenHelpers.js";

export default passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      //finduser, return if not found, compare the users credentials with bcrypt and then return answer with done function, done(error, user)
      const findUser = await User.findOne({ email });
      if (!findUser) return done(null, false, { message: "Invalid email" });

      const checkPassword = await comparePassword(password, findUser.password);
      if (!checkPassword) {
        return done(null, false, { message: "Invalid password" });
      }

      //skapa accesstoken, refreshtoken och spara den i databasen.
      const accessToken = createAccessToken(findUser._id);
      const refreshToken = createRefreshToken();
      await saveRefreshToken(refreshToken, findUser._id);

      done(null, findUser, { accessToken, refreshToken });
    } catch (error) {
      done(error);
    }
  })
);
