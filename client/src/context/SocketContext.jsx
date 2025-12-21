import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuthContext } from "./AuthContext";
import {
  initializeSocket,
  connectSocket,
  disconnectSocket,
} from "../socket/socketClient";

const SocketContext = createContext(null);

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { accessToken, user } = useAuthContext();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const socketRef = useRef(null);

  useEffect(() => {
    // Only initialize socket if user is authenticated
    if (accessToken && user) {
      console.log("🔌 Initializing socket for user:", user.username);

      socketRef.current = initializeSocket(accessToken);

      // Set up connection listeners
      socketRef.current.on("connect", () => {
        setIsConnected(true);
      });

      socketRef.current.on("disconnect", () => {
        setIsConnected(false);
      });

      // Listen for online users list
      socketRef.current.on("online_users", ({ userIds }) => {
        console.log("👥 Online users:", userIds);
        setOnlineUsers(new Set(userIds));
      });

      // Listen for user coming online
      socketRef.current.on("user_online", ({ userId }) => {
        console.log("✅ User online:", userId);
        setOnlineUsers((prev) => new Set([...prev, userId]));
      });

      // Listen for user going offline
      socketRef.current.on("user_offline", ({ userId }) => {
        console.log("❌ User offline:", userId);
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      });

      // Connect the socket
      connectSocket();

      // Cleanup on unmount or when auth changes
      return () => {
        console.log("🔌 Cleaning up socket");
        disconnectSocket();
        socketRef.current = null;
        setIsConnected(false);
        setOnlineUsers(new Set());
      };
    }
  }, [accessToken, user]);

  const value = {
    socket: socketRef.current,
    isConnected,
    onlineUsers,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
