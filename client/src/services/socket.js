import { io } from "socket.io-client";

const socket = io("https://mern-project-management-repo.onrender.com", {
  transports: ["websocket"], // 🔥 avoid polling errors
  reconnection: true,        // 🔁 auto reconnect
  reconnectionAttempts: 5,
  timeout: 20000,
});

export default socket;