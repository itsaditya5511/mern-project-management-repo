import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const { user, darkMode } = useContext(AuthContext);

  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        padding: "20px",
        background: darkMode ? "#1e1e2f" : "#ffffff",
        color: darkMode ? "#fff" : "#000",
        boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
      }}
    >
      <h4 className="text-center mb-4">Dashboard</h4>

      <ul className="nav flex-column">

        {/* ✅ Dashboard */}
        <li className="nav-item mb-2">
          <Link to="/dashboard" className="nav-link" style={{ color: "inherit" }}>
            📊 Dashboard
          </Link>
        </li>

        {/* ✅ Analytics */}
        {user?.role === "admin" && (
          <li className="nav-item mb-2">
            <Link to="/analytics" className="nav-link" style={{ color: "inherit" }}>
              📈 Analytics
            </Link>
          </li>
        )}

        {/* ✅ FIXED PROJECT LINK */}
        {(user?.role === "admin" || user?.role === "manager") && (
          <li className="nav-item mb-2">
            <Link to="/dashboard" className="nav-link" style={{ color: "inherit" }}>
              📁 Projects
            </Link>
          </li>
        )}

      </ul>
    </div>
  );
}