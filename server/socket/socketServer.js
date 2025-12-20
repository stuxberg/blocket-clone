import { Server } from "socket.io";
import { socketAuthMiddleware } from "./socketAuth.js";
import { registerMessageHandlers } from "./messageHandlers.js";

export const initializeSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173", // Vite dev server
      credentials: true,
    },
    // Connection options
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Apply authentication middleware
  io.use(socketAuthMiddleware);

  // Handle connections
  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.user.username} (${socket.id})`);

    // Attach user info to socket
    socket.userId = socket.user._id.toString();
    socket.username = socket.user.username;

    // Emit successful authentication
    socket.emit("authenticated", { userId: socket.userId });

    // Register all message-related event handlers
    registerMessageHandlers(io, socket);

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      console.log(
        `❌ User disconnected: ${socket.username} - Reason: ${reason}`
      );
    });
  });

  return io;
};
