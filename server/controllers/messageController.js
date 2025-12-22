import { Conversation } from "../models/conversation.js";
import { Message } from "../models/Message.js";
import { Product } from "../models/product.js";

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      $or: [{ buyer: userId }, { seller: userId }],
      isActive: true,
    })
      .populate("product", "title images")
      .populate("buyer seller", "username profilePicture")
      .sort({ lastMessageDate: -1 });

    // Transform to include "other user" and unread count for each conversation
    const transformedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const isBuyer = conv.buyer._id.toString() === userId.toString();
        const otherUser = isBuyer ? conv.seller : conv.buyer;

        // Count unread messages (messages from other user that current user hasn't read)
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          sender: { $ne: userId },
          isRead: false,
        });

        return {
          _id: conv._id,
          product: conv.product,
          otherUser: {
            _id: otherUser._id,
            username: otherUser.username,
            profilePicture: otherUser.profilePicture,
          },
          lastMessage: conv.lastMessage,
          lastMessageDate: conv.lastMessageDate,
          unreadCount,
          createdAt: conv.createdAt,
        };
      })
    );

    res.json(transformedConversations);
  } catch (error) {
    next(error);
  }
};

// Get or create conversation by product ID
export const getOrCreateConversationByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const buyerId = req.user._id;

    // Get product
    const product = await Product.findById(productId).populate("seller");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const sellerId = product.seller._id;

    // Don't allow user to message themselves
    if (buyerId.toString() === sellerId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot message yourself",
      });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      product: productId,
      buyer: buyerId,
      seller: sellerId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        product: productId,
        buyer: buyerId,
        seller: sellerId,
      });
    }

    // Populate for response
    await conversation.populate("product", "title images");
    await conversation.populate("buyer seller", "username profilePicture");

    res.status(200).json({
      success: true,
      conversation: conversation.toObject(),
    });
  } catch (error) {
    next(error);
  }
};

// Get messages in a conversation
export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const isBuyer = conversation.buyer.toString() === userId.toString();
    const isSeller = conversation.seller.toString() === userId.toString();

    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Fetch messages
    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "username profilePicture")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};
