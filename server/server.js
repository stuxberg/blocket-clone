import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { connectDB } from "./config/database.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/error.js";
import userRouter from "./routes/users.js";
import listingsRouter from "./routes/listings.js";
import messagesRouter from "./routes/messages.js";
import passport from "passport";
import "./config/local-strategy.js";
import "./config/jwt-strategy.js";
import { initializeSocketServer } from "./socket/socketServer.js";

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT;
  const app = express();

  // Create HTTP server (needed for Socket.io)
  const httpServer = createServer(app);

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json()); //middleware that check raw body, checks whether the Content-Type is application/json. parses the JSON into a javascript object
  app.use(cookieParser());
  app.use(passport.initialize());

  app.use("/api/auth", userRouter);
  app.use("/api/listings", listingsRouter);
  app.use("/api/messages", messagesRouter);

  app.use(errorHandler);

  // Initialize Socket.io
  const io = initializeSocketServer(httpServer);

  // Make io accessible to routes if needed
  app.set("io", io);

  httpServer.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
};

startServer();
