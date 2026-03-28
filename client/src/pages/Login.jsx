import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";

import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { motion } from "framer-motion";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // ✅ default light
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔥 HANDLE LOGIN
  const handleSubmit = async () => {
    if (!data.email || !data.password) {
      return alert("Please enter email and password");
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      login(res.data);

      const role = res.data.user.role;

      if (role === "admin") {
        navigate("/analytics");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        // ✅ LIGHT vs DARK BACKGROUND
        background: darkMode
          ? "linear-gradient(135deg, #020617, #0f172a)"
          : "linear-gradient(135deg, #e0f2fe, #ffffff)",

        transition: "0.5s",
      }}
    >
      {/* 🌙 TOGGLE */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "8px 12px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card
          style={{
            width: "380px",
            padding: "25px",
            borderRadius: "15px",
            backdropFilter: "blur(10px)",
            background: darkMode
              ? "rgba(255,255,255,0.05)"
              : "#ffffff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              style={{ fontWeight: "bold" }}
            >
              Welcome Back 👋
            </Typography>

            <Typography
              align="center"
              style={{ marginBottom: "20px", opacity: 0.7 }}
            >
              Login to continue
            </Typography>

            {/* EMAIL */}
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={data.email}
              onChange={(e) =>
                setData({ ...data, email: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            {/* PASSWORD */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={data.password}
              onChange={(e) =>
                setData({ ...data, password: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* LOGIN BUTTON */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                marginTop: "20px",
                padding: "10px",
                fontWeight: "bold",
                borderRadius: "10px",
                background:
                  "linear-gradient(45deg, #3b82f6, #6366f1)",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            {/* 🔥 SIGN UP LINK */}
            <Typography
              align="center"
              style={{ marginTop: "15px", fontSize: "14px" }}
            >
              New here?{" "}
              <span
                onClick={() => navigate("/register")}
                style={{
                  color: "#3b82f6",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Sign up
              </span>
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}