import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Restore auth ONCE on app start
  useEffect(() => {
    const restoreAuth = async () => {
  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    setLoading(false);
    return;
  }

  try {
    const res = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    setToken(storedToken);
    setUser(res.data.email);

  } catch (err) {
    localStorage.removeItem("token");
  }

  setLoading(false);
};

    restoreAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const accessToken = response.data.access_token;

      localStorage.setItem("token", accessToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      const res = await api.get("/users/me");

      setToken(accessToken);
      setUser(res.data.email);

      return { success: true };

    } catch (error) {
      return { success: false, message: "Invalid email or password" };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ login, logout, isAuthenticated, user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}