import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ConversationList from "../components/ConversationList";
import MessageThread from "../components/MessageThread";
import "../css/Messages.css";
import { useAuthContext } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";

import { getConversations, getMessages } from "../services/messageAPI";

function Messages() {
  const { user } = useAuthContext();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocketContext();

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

  //join conversation room when active conversation changes
  useEffect(() => {
    if (!socket || !activeConversationId) return;

    socket.emit("join_conversation", { conversationId: activeConversationId });

    return () => {
      socket.emit("leave_conversation", {
        conversationId: activeConversationId,
      });
    };
  }, [socket, activeConversationId]);

  //listen for new messages

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = ({ message, conversationId }) => {
      if (conversationId === activeConversationId) {
        setMessages((prev) => [...prev, message]);
      }
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv._id === conversationId) {
            return {
              ...conv,
              lastMessage: message.content,
              lastMessageDate: message.createdAt,
            };
          }
          return conv;
        })
      );
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, activeConversationId]);

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
  };

  const activeConversation = conversations.find(
    (conv) => conv._id === activeConversationId
  );

  //listen for new messages with socket

  const handleSendMessage = (content) => {
    if (!socket || !activeConversationId || !user) return;

    socket.emit("send_message", {
      conversationId: activeConversationId,
      content,
    });
  };

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
          onSendMessage={handleSendMessage}
        />
      </div>
    </>
  );
}

export default Messages;
