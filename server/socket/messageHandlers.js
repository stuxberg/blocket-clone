import { Message } from "../models/Message.js";
import { Conversation } from "../models/conversation.js";

export const registerMessageHandlers = (io, socket) => {
  // Join a conversation room
  socket.on("join_conversation", async ({ conversationId }) => {
    try {
      // Verify user is part of this conversation
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

      // Join the room
      socket.join(`conversation:${conversationId}`);
      console.log(
        `📨 ${socket.username} joined conversation:${conversationId}`
      );
    } catch (error) {
      console.error("Error joining conversation:", error);
      socket.emit("error", { message: "Failed to join conversation" });
    }
  });

  // Leave a conversation room
  socket.on("leave_conversation", ({ conversationId }) => {
    socket.leave(`conversation:${conversationId}`);
    console.log(`👋 ${socket.username} left conversation:${conversationId}`);
  });

  // Send a message
  socket.on(
    "send_message",
    async ({ conversationId, content, type = "text", tempId }) => {
      try {
        // Verify conversation access
        const conversation = await Conversation.findById(conversationId)
          .populate("buyer seller", "username profilePicture");

        if (!conversation) {
          return socket.emit("message_error", {
            error: "Conversation not found",
            tempId,
          });
        }

        const userId = socket.userId;
        const isBuyer = conversation.buyer._id.toString() === userId;
        const isSeller = conversation.seller._id.toString() === userId;

        if (!isBuyer && !isSeller) {
          return socket.emit("message_error", {
            error: "Unauthorized",
            tempId,
          });
        }

        // Create message
        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          content,
          type,
          isRead: false,
        });

        // Populate sender info
        await message.populate("sender", "username profilePicture");

        // Emit to sender (confirmation)
        socket.emit("message_sent", {
          message: message.toObject(),
          tempId,
        });

        // Emit to other user in conversation room
        socket.to(`conversation:${conversationId}`).emit("new_message", {
          message: message.toObject(),
          conversationId,
        });

        // The conversation update happens via Message model post-save hook
        // Emit conversation update to both users
        io.to(`conversation:${conversationId}`).emit("conversation_updated", {
          conversationId,
          lastMessage: content,
          lastMessageDate: message.createdAt,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("message_error", {
          error: error.message || "Failed to send message",
          tempId,
        });
      }
    }
  );

  // Typing indicators
  socket.on("typing_start", ({ conversationId }) => {
    socket.to(`conversation:${conversationId}`).emit("user_typing", {
      conversationId,
      userId: socket.userId,
      username: socket.username,
    });
  });

  socket.on("typing_stop", ({ conversationId }) => {
    socket.to(`conversation:${conversationId}`).emit("user_stopped_typing", {
      conversationId,
      userId: socket.userId,
    });
  });

  // Mark messages as read
  socket.on("mark_as_read", async ({ conversationId }) => {
    try {
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return socket.emit("error", { message: "Conversation not found" });
      }

      // Update all unread messages in this conversation not sent by current user
      await Message.updateMany(
        {
          conversation: conversationId,
          sender: { $ne: socket.userId },
          isRead: false,
        },
        { isRead: true }
      );

      // Notify other user
      socket.to(`conversation:${conversationId}`).emit("messages_read", {
        conversationId,
        userId: socket.userId,
        readAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      socket.emit("error", { message: "Failed to mark messages as read" });
    }
  });
};
