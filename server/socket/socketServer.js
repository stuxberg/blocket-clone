import { Server } from "socket.io";
import { socketAuthMiddleware } from "./socketAuth.js";
import { registerMessageHandlers } from "./messageHandlers.js";

// Track online users: Map<userId, Set<socketId>>
const onlineUsers = new Map();

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

    // Track user as online
    if (!onlineUsers.has(socket.userId)) {
      onlineUsers.set(socket.userId, new Set());
    }
    onlineUsers.get(socket.userId).add(socket.id);

    // Emit successful authentication
    socket.emit("authenticated", { userId: socket.userId });

    // Broadcast to all clients that this user is online
    io.emit("user_online", { userId: socket.userId });

    // Send list of currently online users to newly connected client
    const onlineUserIds = Array.from(onlineUsers.keys());
    socket.emit("online_users", { userIds: onlineUserIds });

    // Register all message-related event handlers
    registerMessageHandlers(io, socket);

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      console.log(
        `❌ User disconnected: ${socket.username} - Reason: ${reason}`
      );

      // Remove this socket from online users
      const userSockets = onlineUsers.get(socket.userId);
      if (userSockets) {
        userSockets.delete(socket.id);

        // If user has no more active sockets, remove from online users
        if (userSockets.size === 0) {
          onlineUsers.delete(socket.userId);
          // Broadcast to all clients that this user is offline
          io.emit("user_offline", { userId: socket.userId });
        }
      }
    });
  });

  return io;
};
