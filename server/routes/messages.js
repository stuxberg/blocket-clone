import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { param } from "express-validator";
import { handleValidationErrors } from "../middleware/handleValidationErrors.js";
import * as messageController from "../controllers/messageController.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Get total unread message count
router.get("/unread-count", messageController.getUnreadCount);

// Get all conversations for current user
router.get("/conversations", messageController.getConversations);

// Get or create conversation by product ID
router.post(
  "/conversations/product/:productId",
  param("productId").isMongoId(),
  handleValidationErrors,
  messageController.getOrCreateConversationByProduct
);

// Get messages in a conversation
router.get(
  "/conversations/:conversationId/messages",
  param("conversationId").isMongoId(),
  handleValidationErrors,
  messageController.getMessages
);

// Mark conversation messages as read (REST alternative to socket)
router.post(
  "/conversations/:conversationId/read",
  param("conversationId").isMongoId(),
  handleValidationErrors,
  messageController.markAsRead
);

export default router;
