import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { param } from "express-validator";
import { handleValidationErrors } from "../middleware/handleValidationErrors.js";
import {
  getConversations,
  getMessages,
  getOrCreateConversationByProduct,
} from "../controllers/messageController.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

router.get("/conversations", getConversations);

// Get or create conversation by product ID
router.post(
  "/conversations/product/:productId",
  param("productId").isMongoId(),
  handleValidationErrors,
  getOrCreateConversationByProduct
);

// Get messages in a conversation
router.get(
  "/conversations/:conversationId/messages",
  param("conversationId").isMongoId(),
  handleValidationErrors,
  getMessages
);
export default router;
