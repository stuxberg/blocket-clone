import React, { useState, useRef, useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";

function MessageInput({ onSendMessage, conversationId }) {
  const [message, setMessage] = useState("");
  const { socket } = useSocketContext();
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");

      // Stop typing indicator
      if (socket && isTypingRef.current && conversationId) {
        socket.emit("typing_stop", { conversationId });
        isTypingRef.current = false;
      }
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);

    if (!socket || !conversationId) return;

    // Emit typing start if not already typing
    if (!isTypingRef.current && e.target.value.length > 0) {
      socket.emit("typing_start", { conversationId });
      isTypingRef.current = true;
    }

    // Reset typing timeout
    clearTimeout(typingTimeoutRef.current);

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current && socket && conversationId) {
        socket.emit("typing_stop", { conversationId });
        isTypingRef.current = false;
      }
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef.current);
      if (socket && isTypingRef.current && conversationId) {
        socket.emit("typing_stop", { conversationId });
      }
    };
  }, [socket, conversationId]);

  return (
    <form className="message-input-container" onSubmit={handleSubmit}>
      <button type="button" className="attachment-button">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
      </button>
      <input
        type="text"
        className="message-input"
        placeholder="Skriv ett meddelande..."
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <div className="input-hint">Shift+Retur för radbrytning</div>
    </form>
  );
}

export default MessageInput;
