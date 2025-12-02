import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";

function MessageThread({ conversation, currentUserId, onSendMessage }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

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

  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentGroup = null;

    messages.forEach((message) => {
      const messageDate = new Date(message.timestamp).toDateString();

      if (!currentGroup || currentGroup.date !== messageDate) {
        currentGroup = { date: messageDate, messages: [] };
        groups.push(currentGroup);
      }

      currentGroup.messages.push(message);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(conversation.messages);

  return (
    <div className="message-thread">
      <div className="message-thread-header">
        <div className="thread-user-info">
          <img
            src={
              conversation.otherUser.avatar ||
              "https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default"
            }
            alt={conversation.otherUser.name}
            className="thread-avatar"
          />
          <h3>{conversation.otherUser.name}</h3>
        </div>
        <button className="thread-menu-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      <div className="message-thread-content">
        <div className="product-context">
          <img
            src={
              conversation.otherUser.avatar ||
              "https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default"
            }
            alt=""
            className="product-context-avatar"
          />
          <span className="product-context-name">(Annons)</span>
        </div>

        {conversation.product && (
          <div className="product-info-card">
            <p>{conversation.product.description}</p>
          </div>
        )}

        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="message-date-group">
            {group.messages.map((message) => (
              <div key={message.id} className="message-wrapper">
                <div className="message-timestamp">
                  {formatTime(message.timestamp)}
                </div>
                <div
                  className={`message ${
                    message.senderId === currentUserId ? "sent" : "received"
                  }`}
                >
                  {message.content}
                </div>
                {message.type === "acknowledge" && (
                  <button className="acknowledge-button">förstår</button>
                )}
              </div>
            ))}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}

export default MessageThread;
