import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ConversationList from "../components/ConversationList";
import MessageThread from "../components/MessageThread";
import "../css/Messages.css";
import { useAuthContext } from "../context/AuthContext";

import { getConversations, getMessages } from "../services/messageAPI";

function Messages() {
  const { user } = useAuthContext();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);

        // Auto-select first conversation if available
        if (data.length > 0 && !activeConversationId) {
          setActiveConversationId(data[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const data = await getMessages(activeConversationId);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [activeConversationId]);

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
  };

  const activeConversation = conversations.find(
    (conv) => conv._id === activeConversationId
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading conversations...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="messages-page">
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
        />
        <MessageThread
          conversation={activeConversation}
          messages={messages}
          currentUserId={user?.id}
        />
      </div>
    </>
  );
}

export default Messages;
