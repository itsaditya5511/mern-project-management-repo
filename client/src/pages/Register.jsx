import { useState, useContext } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  InputAdornment,
  IconButton,
  MenuItem,
} from "@mui/material";

import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { motion } from "framer-motion";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { darkMode } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!data.name || !data.email || !data.password) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      await API.post("/auth/register", data);

      alert("Registered Successfully ✅");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
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
        position: "relative",

        // 🔥 LIGHT / DARK BACKGROUND
        background: darkMode
          ? "linear-gradient(135deg, #020617, #0f172a)"
          : "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
        transition: "0.5s",
      }}
    >
      {/* ✨ CREATIVE GLOW CIRCLES */}
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "#3b82f6",
          filter: "blur(120px)",
          top: "-50px",
          left: "-50px",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "#6366f1",
          filter: "blur(120px)",
          bottom: "-50px",
          right: "-50px",
          opacity: 0.4,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card
          style={{
            width: "380px",
            padding: "25px",
            borderRadius: "16px",
            backdropFilter: "blur(15px)",
            background: darkMode
              ? "rgba(255,255,255,0.05)"
              : "#ffffff",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
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
              Create Account ✨
            </Typography>

            <Typography
              align="center"
              style={{ marginBottom: "20px", opacity: 0.7 }}
            >
              Join and start managing projects 🚀
            </Typography>

            {/* NAME */}
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              value={data.name}
              onChange={(e) =>
                setData({ ...data, name: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />

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

            {/* ROLE */}
            <TextField
              select
              fullWidth
              label="Select Role"
              margin="normal"
              value={data.role}
              onChange={(e) =>
                setData({ ...data, role: e.target.value })
              }
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Project Manager</MenuItem>
              <MenuItem value="member">Team Member</MenuItem>
            </TextField>

            {/* BUTTON */}
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
              {loading ? "Registering..." : "Register"}
            </Button>

            {/* LOGIN LINK */}
            <Typography
              align="center"
              style={{ marginTop: "15px", fontSize: "14px" }}
            >
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                style={{
                  color: "#3b82f6",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Login
              </span>
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}