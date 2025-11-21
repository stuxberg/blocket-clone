import "dotenv/config";
import express from "express";
import { connectDB } from "./config/database.js";
import cors from "cors";
import errorHandler from "./middleware/error.js";
import userRouter from "./routes/users.js";

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT;
  const app = express();
  app.use(cors({ origin: true }));
  app.use(express.json()); //middleware that check raw body, checks whether the Content-Type is application/json. parses the JSON into a javascript object

  app.get("/", (req, res) => {
    res.json({ nugget: "nugget" });
  });

  app.use("/api/auth", userRouter);

  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
};

startServer();
