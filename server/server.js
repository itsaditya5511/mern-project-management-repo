const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const columnRoutes = require("./routes/columnRoutes");

dotenv.config();

const app = express();

// ✅ FRONTEND URL (IMPORTANT)
const FRONTEND_URL = "https://mern-project-management-repo.vercel.app";

// middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// static uploads
app.use("/uploads", express.static("uploads"));

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/workspace", require("./routes/workspaceRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/columns", columnRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API Running");
});

// server
const server = http.createServer(app);

// ✅ SOCKET FIX
const io = new Server(server, {
  cors: {
    origin: "https://mern-project-management-repo.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("taskMoved", (data) => {
    socket.broadcast.emit("taskUpdated", data);
  });
});

// ✅ IMPORTANT: use dynamic PORT
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});