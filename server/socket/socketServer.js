import { Server } from "socket.io";

// Track online users: Map<userId, Set<socketId>>
export const initializeSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173", // Vite dev server
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // Handle socket connection
    console.log("User connected");
  });

  return io;
};
