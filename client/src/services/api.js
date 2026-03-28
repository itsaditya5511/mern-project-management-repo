import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ==============================
// 🔐 ATTACH TOKEN
// ==============================
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// ==============================
// 📋 TASK APIs
// ==============================

// Get Tasks
export const getTasksByProject = (projectId) =>
  API.get(`/tasks/${projectId}`);

// Create Task
export const createTask = (data) =>
  API.post("/tasks", data);

// 🔄 Move Task (NEW - IMPORTANT)
export const moveTask = (taskId, columnId) =>
  API.put(`/tasks/${taskId}/move`, { columnId });

// 🔄 Update Order
export const updateTaskOrder = (taskId, order) =>
  API.put(`/tasks/${taskId}/order`, { order });

export default API;