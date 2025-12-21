import { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import { useSocketContext } from "./SocketContext";
import api from "../api/client";

const MessagesContext = createContext(null);

export const useMessagesContext = () => useContext(MessagesContext);

export const MessagesProvider = ({ children }) => {
  const { user } = useAuthContext();
  const { socket } = useSocketContext();
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  // Fetch initial unread count
  useEffect(() => {
    if (!user) {
      setTotalUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const response = await api.get("/messages/unread-count");
        setTotalUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    fetchUnreadCount();
  }, [user]);

  // Listen for socket events and update count
  useEffect(() => {
    if (!socket || !user) return;

    const refetchUnreadCount = () => {
      // Always refetch from server to get accurate count
      api
        .get("/messages/unread-count")
        .then((response) => setTotalUnreadCount(response.data.unreadCount))
        .catch((error) =>
          console.error("Failed to fetch unread count:", error)
        );
    };

    const handleNewMessage = ({ message }) => {
      // Only refetch if message is from someone else
      if (message.sender._id !== user.id) {
        // Use a small delay to allow auto-mark-as-read to complete first
        setTimeout(refetchUnreadCount, 200);
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("messages_read", refetchUnreadCount);
    socket.on("connect", refetchUnreadCount);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("messages_read", refetchUnreadCount);
      socket.off("connect", refetchUnreadCount);
    };
  }, [socket, user]);

  // Function to manually update count (for immediate updates)
  const decrementUnreadCount = (amount) => {
    setTotalUnreadCount((prev) => Math.max(0, prev - amount));
  };

  const value = {
    totalUnreadCount,
    decrementUnreadCount,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};
