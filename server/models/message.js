import mongoose from "mongoose";
import { Conversation } from "./conversation.js";

const messageSchema = mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["text", "acknowledge"],
      default: "text",
    },
  },
  { timestamps: true }
);

// Indexes for queries
messageSchema.index({ conversation: 1, createdAt: 1 });
messageSchema.index({ sender: 1 });

// Hook: Update conversation's lastMessage and lastMessageDate when message is created
messageSchema.post("save", async function () {
  try {
    await Conversation.findByIdAndUpdate(this.conversation, {
      lastMessage: this.content,
      lastMessageDate: this.createdAt,
    });
  } catch (error) {
    console.error("Error updating conversation:", error);
  }
});

export const Message = mongoose.model("Message", messageSchema);
