import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = (accessToken) => {
  if (socket?.connected) {
    console.log("Socket already connected");
    return socket;
  }

  socket = io("http://localhost:8000", {
    auth: {
      token: accessToken,
    },
    autoConnect: false, // Manual connection control
  });

  // Connection event handlers
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("authenticated", ({ userId }) => {
    console.log("✅ Socket authenticated for user:", userId);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error.message);
  });

  socket.on("auth_error", ({ message }) => {
    console.error("❌ Socket auth error:", message);
    socket.disconnect();
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.warn("Socket not initialized");
    return null;
  }
  return socket;
};

export const connectSocket = () => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};
