import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: {
      type: String,
    },
    lastMessageDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Unique compound index - only one conversation per product-buyer-seller combination
conversationSchema.index({ product: 1, buyer: 1, seller: 1 }, { unique: true });

// Indexes for queries
conversationSchema.index({ buyer: 1, lastMessageDate: -1 });
conversationSchema.index({ seller: 1, lastMessageDate: -1 });
conversationSchema.index({ product: 1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);
