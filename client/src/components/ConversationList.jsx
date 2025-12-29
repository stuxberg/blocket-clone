import React from "react";

function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Idag";
    if (diffDays === 1) return "Igår";

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
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  return (
    <div className="conversation-list">
      <div className="conversation-list-header">
        <h2>Meddelanden</h2>
      </div>
      <div className="conversation-list-items">
        {conversations.length === 0 ? (
          <div className="empty-state">Inga konversationer ännu</div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation._id}
              className={`conversation-item ${
                activeConversationId === conversation._id ? "active" : ""
              }`}
              onClick={() => onSelectConversation(conversation._id)}
            >
              <div className="conversation-avatar">
                <img
                  src={
                    conversation.otherUser.profilePicture ||
                    "https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default"
                  }
                  alt={`Profilbild för ${conversation.otherUser.username}`}
                />
                {conversation.product && conversation.product.images?.[0] && (
                  <div className="product-thumbnail">
                    <img src={conversation.product.images[0]} alt="" />
                  </div>
                )}
              </div>
              <div className="conversation-content">
                <div className="conversation-header">
                  <span className="conversation-name">
                    {conversation.otherUser.username}
                  </span>
                  <div className="conversation-meta">
                    <span className="conversation-date">
                      {formatDate(conversation.lastMessageDate)}
                    </span>
                  </div>
                </div>
                {conversation.product && (
                  <div className="conversation-product">
                    {conversation.product.title}
                  </div>
                )}
                <div className="conversation-preview">
                  {conversation.lastMessage || "Ingen konversation ännu"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ConversationList;
