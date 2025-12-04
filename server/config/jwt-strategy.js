import passport from "passport";
import { Strategy } from "passport-jwt";
import { User } from "../models/user.js";
const JWT_SECRET = process.env.JWT_SECRET;
import { ExtractJwt } from "passport-jwt";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET enviroment variable is required");
}

// Instructs the strategy to look for the token in the Authorization: Bearer header
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

//the strategy will run if it finds the accesstoken in the header.
passport.use(
  new Strategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ _id: jwt_payload.sub });
      console.log(user);

      if (!user) {
        return done(null, false, {
          message: "User not found, invalid or expired token",
        });
      }

      return done(null, user);
    } catch (error) {
      done(error);
    }
  })
);
