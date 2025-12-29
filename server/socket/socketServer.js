import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { socketAuthMiddleware } from "./socketAuth.js";
import { Conversation } from "../models/conversation.js";
import { Message } from "../models/Message.js";

export const initializeSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173", // Vite dev server
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.username);

    socket.on("join_conversation", async ({ conversationId }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          return socket.emit("error", { message: "Conversation not found" });
        }

        const userId = socket.userId;

        const isBuyer = conversation.buyer.toString() === userId;
        const isSeller = conversation.seller.toString() === userId;

        if (!isBuyer && !isSeller) {
          return socket.emit("error", {
            message: "Unauthorized: Not part of this conversation",
          });
        }

        socket.join(`conversation:${conversationId}`);
        console.log(
          `📨 ${socket.username} joined conversation:${conversationId}`
        );
      } catch (error) {
        console.error("Error joining conversation:", error);
        socket.emit("error", { message: "Failed to join conversation" });
      }
    });

    socket.on("leave_conversation", ({ conversationId }) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`👋 ${socket.username} left conversation:${conversationId}`);
    });

    socket.on("send_message", async ({ conversationId, content }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          return socket.emit("error", { message: "Conversation not found" });
        }

        const userId = socket.userId;

        const isBuyer = conversation.buyer.toString() === userId;
        const isSeller = conversation.seller.toString() === userId;

        if (!isBuyer && !isSeller) {
          return socket.emit("error", {
            message: "Unauthorized: Not part of this conversation",
          });
        }

        const otherUserId = isBuyer
          ? conversation.buyer.toString()
          : conversation.seller.toString();

        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          content,
        });

        // Populate sender with user details
        await message.populate("sender", "username profilePicture");

        const roomName = `conversation:${conversationId}`;

        // Broadcast to all participants including sender
        io.to(roomName).emit("new_message", {
          message: message.toObject(),
          conversationId,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("message_error", {
          error: error.message || "Failed to send message",
        });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`${socket.username} disconnected - Reason: ${reason}`);
    });
  });

  return io;
};
