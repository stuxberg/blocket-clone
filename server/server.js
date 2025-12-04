import "dotenv/config";
import express from "express";
import { connectDB } from "./config/database.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/error.js";
import userRouter from "./routes/users.js";
import listingsRouter from "./routes/listings.js";
import passport from "passport";
import "./config/local-strategy.js";
import "./config/jwt-strategy.js";

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT;
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json()); //middleware that check raw body, checks whether the Content-Type is application/json. parses the JSON into a javascript object
  app.use(cookieParser());
  app.use(passport.initialize());

  app.use("/api/auth", userRouter);
  app.use("/api/listings", listingsRouter);

  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
};

startServer();
