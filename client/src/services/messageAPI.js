import api from "../api/client";

// Get all conversations
export const getConversations = async () => {
  const response = await api.get("/messages/conversations");
  return response.data;
};

// Get or create conversation by product ID
export const getOrCreateConversation = async (productId) => {
  const response = await api.post(
    `/messages/conversations/product/${productId}`
  );
  return response.data;
};

// Get messages in a conversation
export const getMessages = async (conversationId) => {
  const response = await api.get(
    `/messages/conversations/${conversationId}/messages`
  );
  return response.data;
};

// Mark messages as read (REST alternative)
export const markMessagesAsRead = async (conversationId) => {
  const response = await api.post(
    `/messages/conversations/${conversationId}/read`
  );
  return response.data;
};
