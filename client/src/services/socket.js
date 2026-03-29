import { io } from "socket.io-client";

const socket = io("https://mern-project-management-repo.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,   // ✅ important for CORS
  reconnection: true,
  reconnectionAttempts: 5,
  timeout: 20000,
});

export default socket;