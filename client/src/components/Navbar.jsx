import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { logout, darkMode, setDarkMode } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔥 HANDLE LOGOUT
  const handleLogout = () => {
    logout(); // clear token + user
    navigate("/"); // 🔥 redirect to login
  };

  return (
    <nav
      style={{
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: darkMode ? "#0f172a" : "#ffffff",
        color: darkMode ? "#fff" : "#000",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* LEFT */}
      <h4 style={{ margin: 0 }}>🚀 Project Manager</h4>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
        {/* 🌙 TOGGLE */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: darkMode ? "#1e293b" : "#e2e8f0",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* 🔥 LOGOUT FIXED */}
        <button
          onClick={handleLogout}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(45deg, #ef4444, #f43f5e)",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}