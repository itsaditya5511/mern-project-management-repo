import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"], // 🔥 avoid polling errors
  reconnection: true,        // 🔁 auto reconnect
  reconnectionAttempts: 5,
  timeout: 20000,
});

export default socket;