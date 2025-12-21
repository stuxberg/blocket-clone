import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import { useSocketContext } from "../context/SocketContext";

function MessageThread({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  isConnected,
}) {
  const messagesEndRef = useRef(null);
  const { socket, onlineUsers } = useSocketContext();
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  // Check if the OTHER user in the conversation is online
  const isOtherUserOnline = conversation
    ? onlineUsers.has(conversation.otherUser._id)
    : false;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for typing indicators
  useEffect(() => {
    if (!socket || !conversation) return;

    const handleUserTyping = ({ userId, username }) => {
      if (userId !== currentUserId) {
        setIsTyping(true);
        setTypingUser(username);
      }
    };

    const handleUserStoppedTyping = ({ userId }) => {
      if (userId !== currentUserId) {
        setIsTyping(false);
        setTypingUser(null);
      }
    };

    socket.on("user_typing", handleUserTyping);
    socket.on("user_stopped_typing", handleUserStoppedTyping);

    return () => {
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stopped_typing", handleUserStoppedTyping);
    };
  }, [socket, conversation, currentUserId]);

  if (!conversation) {
    return (
      <div className="message-thread empty">
        <div className="empty-state">
          <p>Välj en konversation för att visa meddelanden</p>
        </div>
      </div>
    );
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    const time = `${date.getHours()}:${String(date.getMinutes()).padStart(
      2,
      "0"
    )}`;

    if (diffDays === 0) return `Idag ${time}`;
    if (diffDays === 1) return `Igår ${time}`;

    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "maj",
      "jun",
      "jul",
      "aug",
      "sep",
      "okt",
      "nov",
      "dec",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${time}`;
  };

  return (
    <div className="message-thread">
      <div className="message-thread-header">
        <div className="thread-user-info">
          <img
            src={
              conversation.otherUser.profilePicture ||
              "https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default"
            }
            alt={conversation.otherUser.username}
            className="thread-avatar"
          />
          <div>
            <h3>{conversation.otherUser.username}</h3>
            <span
              className={`status-indicator ${isOtherUserOnline ? "online" : "offline"}`}
            >
              {isOtherUserOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="message-thread-content">
        {conversation.product && (
          <div className="product-info-card">
            <img
              src={conversation.product.images?.[0]}
              alt={conversation.product.title}
            />
            <p>{conversation.product.title}</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message._id || message.tempId} className="message-wrapper">
            <div className="message-timestamp">
              {formatTime(message.createdAt)}
            </div>
            <div
              className={`message ${
                message.sender._id === currentUserId ? "sent" : "received"
              } ${message.tempId ? "pending" : ""}`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="typing-indicator">{typingUser} skriver...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSendMessage={onSendMessage}
        conversationId={conversation._id}
      />
    </div>
  );
}

export default MessageThread;
