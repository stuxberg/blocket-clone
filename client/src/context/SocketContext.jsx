import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { accessToken, user } = useAuthContext();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const socketRef = useRef(null);

  useEffect(() => {
    if (!accessToken || !user) {
      if (socketRef.current) {
        console.log("🔌 Disconnecting - user logged out");
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
        setOnlineUsers(new Set());
      }
      return;
    }

    console.log("🔌 Connecting socket for:", user.username);

    // Create socket directly
    const socket = io("http://localhost:8000", {
      auth: { token: accessToken },
      autoConnect: false,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected:", reason);
      setIsConnected(false);
    });

    // ... other listeners ...

    socket.connect();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, user]);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, isConnected, onlineUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
};
