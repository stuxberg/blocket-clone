import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

export const socketAuthMiddleware = async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub).select("username email");

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    socket.userId = user._id.toString();
    socket.username = user.username;
    socket.email = user.email;
    next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    return next(new Error("Authentication error: " + error.message));
  }
};
