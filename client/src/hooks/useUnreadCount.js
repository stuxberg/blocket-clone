import { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import api from "../api/client";

export const useUnreadCount = () => {
  const { user } = useAuthContext();
  const { socket } = useSocketContext();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch initial unread count
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const response = await api.get("/messages/unread-count");
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    fetchUnreadCount();
  }, [user]);

  // Listen for new messages and update count
  useEffect(() => {
    if (!socket || !user) return;

    // Refetch count from server (ensures accuracy)
    const refetchCount = () => {
      api
        .get("/messages/unread-count")
        .then((response) => setUnreadCount(response.data.unreadCount))
        .catch((error) =>
          console.error("Failed to fetch unread count:", error)
        );
    };

    const handleNewMessage = ({ message, conversationId }) => {
      // Only update if message is from someone else
      if (message.sender._id !== user.id) {
        // Optimistic update: increment immediately for instant feedback
        setUnreadCount((prev) => prev + 1);

        // Then refetch after a delay to correct the count
        // (in case the message was in an active conversation and auto-marked as read)
        setTimeout(refetchCount, 400);
      }
    };

    // Listen for events that affect unread count
    socket.on("new_message", handleNewMessage);
    socket.on("messages_read", refetchCount);
    socket.on("connect", refetchCount);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("messages_read", refetchCount);
      socket.off("connect", refetchCount);
    };
  }, [socket, user]);

  return unreadCount;
};
