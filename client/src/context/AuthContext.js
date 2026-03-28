import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) ?? true
  );

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // ✅ LOGIN
  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // 🔥 ROLE HELPERS (IMPORTANT)
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isMember = user?.role === "member";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        darkMode,
        setDarkMode,
        isAdmin,
        isManager,
        isMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};