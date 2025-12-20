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

      // Connect the socket
      connectSocket();

      // Cleanup on unmount or when auth changes
      return () => {
        console.log("🔌 Cleaning up socket");
        disconnectSocket();
        socketRef.current = null;
        setIsConnected(false);
      };
    }
  }, [accessToken, user]);

  const value = {
    socket: socketRef.current,
    isConnected,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
