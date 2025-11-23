import "dotenv/config";
import express from "express";
import { connectDB } from "./config/database.js";
import cors from "cors";
import errorHandler from "./middleware/error.js";
import userRouter from "./routes/users.js";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import "./config/passport-strategy.js";
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT;
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json()); //middleware that check raw body, checks whether the Content-Type is application/json. parses the JSON into a javascript object

  app.use(
    session({
      secret: "sigma",
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
      },
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
      }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api/auth", userRouter);

  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
};

startServer();
