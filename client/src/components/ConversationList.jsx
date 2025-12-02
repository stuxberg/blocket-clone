import React from "react";

function ConversationList({ conversations, activeConversationId, onSelectConversation }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Idag";
    if (diffDays === 1) return "Igår";

    const months = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  return (
    <div className="conversation-list">
      <div className="conversation-list-header">
        <h2>Meddelanden</h2>
      </div>
      <div className="conversation-list-items">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`conversation-item ${activeConversationId === conversation.id ? "active" : ""}`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="conversation-avatar">
              <img
                src={conversation.otherUser.avatar || "https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default"}
                alt={`Profilbild för ${conversation.otherUser.name}`}
              />
              {conversation.product && (
                <div className="product-thumbnail">
                  <img src={conversation.product.image} alt="" />
                </div>
              )}
            </div>
            <div className="conversation-content">
              <div className="conversation-header">
                <span className="conversation-name">
                  {conversation.otherUser.name}
                </span>
                <span className="conversation-date">
                  {formatDate(conversation.lastMessageDate)}
                </span>
              </div>
              {conversation.product && (
                <div className="conversation-product">
                  {conversation.product.name}
                </div>
              )}
              <div className="conversation-preview">
                {conversation.lastMessage}
              </div>
              {conversation.product?.sold && (
                <div className="product-status-badge">Såld</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConversationList;
