import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import KanbanBoard from "./pages/KanbanBoard";
import Analytics from "./pages/Analytics";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔥 DASHBOARD (ALL USERS) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={["admin", "manager", "member"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* 🔥 PROJECT (ADMIN + MANAGER) */}
        <Route
          path="/project/:id"
          element={
            <PrivateRoute roles={["admin", "manager"]}>
              <ProjectPage />
            </PrivateRoute>
          }
        />

        {/* 🔥 KANBAN (ALL USERS) */}
        <Route
          path="/kanban/:id"
          element={
            <PrivateRoute roles={["admin", "manager", "member"]}>
              <KanbanBoard />
            </PrivateRoute>
          }
        />

        {/* 🔥 ANALYTICS (ADMIN ONLY) */}
        <Route
          path="/analytics"
          element={
            <PrivateRoute roles={["admin"]}>
              <Analytics />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;