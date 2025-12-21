import { io } from "socket.io-client";

export const initializeSocket = () => {
  const socket = io("http://localhost:8000", {
    withCredentials: true,
  });
};
