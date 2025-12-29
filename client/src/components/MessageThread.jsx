import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";

function MessageThread({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
              } `}
            >
              {message.content}
            </div>
          </div>
        ))}

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
