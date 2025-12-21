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
  const { socket, isConnected } = useSocketContext();
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

        // Mark messages as read when opening conversation
        if (socket) {
          socket.emit("mark_as_read", { conversationId: activeConversationId });
        }

        // Update unread count to 0 for this conversation
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === activeConversationId
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [activeConversationId, socket]);

  // Socket: Join conversation room when active conversation changes
  useEffect(() => {
    if (!socket || !activeConversationId) return;

    socket.emit("join_conversation", { conversationId: activeConversationId });

    return () => {
      socket.emit("leave_conversation", {
        conversationId: activeConversationId,
      });
    };
  }, [socket, activeConversationId]);

  // Socket: Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = ({ message, conversationId }) => {
      // Add message to current conversation
      if (conversationId === activeConversationId) {
        setMessages((prev) => [...prev, message]);

        // Auto-mark as read if conversation is open
        if (socket && message.sender._id !== user?.id) {
          socket.emit("mark_as_read", { conversationId });
        }
      }

      // Update conversation list
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv._id === conversationId) {
            // If message is from another user and conversation is not active, increment unread
            const isFromOtherUser = message.sender._id !== user?.id;
            const isNotActiveConv = conversationId !== activeConversationId;

            return {
              ...conv,
              lastMessage: message.content,
              lastMessageDate: message.createdAt,
              unreadCount:
                isFromOtherUser && isNotActiveConv
                  ? (conv.unreadCount || 0) + 1
                  : conv.unreadCount || 0,
            };
          }
          return conv;
        })
      );
    };

    const handleMessageSent = ({ message, tempId }) => {
      // Message sent by current user - replace temp message with real one
      setMessages((prev) =>
        prev.map((msg) => (msg.tempId === tempId ? message : msg))
      );
    };

    const handleMessageError = ({ error, tempId }) => {
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
      alert(`Failed to send message: ${error}`);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_sent", handleMessageSent);
    socket.on("message_error", handleMessageError);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_sent", handleMessageSent);
      socket.off("message_error", handleMessageError);
    };
  }, [socket, activeConversationId]);

  // Socket: Handle reconnection
  useEffect(() => {
    if (!socket) return;

    const handleReconnect = async () => {
      console.log("🔄 Reconnected, refreshing data...");

      // Refresh conversations
      try {
        const convs = await getConversations();
        setConversations(convs);

        // Refresh active conversation messages
        if (activeConversationId) {
          const msgs = await getMessages(activeConversationId);
          setMessages(msgs);
        }
      } catch (error) {
        console.error("Failed to refresh data on reconnect:", error);
      }
    };

    socket.on("connect", handleReconnect);

    return () => socket.off("connect", handleReconnect);
  }, [socket, activeConversationId]);

  const handleSendMessage = (content, type = "text") => {
    if (!socket || !activeConversationId || !user) return;

    // Optimistic update with temp ID
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      tempId,
      conversation: activeConversationId,
      sender: {
        _id: user.id,
        username: user.username,
      },
      content,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    // Emit to server
    socket.emit("send_message", {
      conversationId: activeConversationId,
      content,
      type,
      tempId,
    });
  };

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
          onSendMessage={handleSendMessage}
          isConnected={isConnected}
        />
      </div>
    </>
  );
}

export default Messages;
