import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // logged-in user data
  const [loading, setLoading] = useState(true);

  // ✅ Fetch current user (backend /me) with token header
  const fetchUser = async () => {
    const tokenFromLocalStorage = localStorage.getItem("token");
    if (!tokenFromLocalStorage) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${tokenFromLocalStorage}` }
      });
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Signup
  const signup = async (formData) => {
    const res = await api.post("/auth/signup", formData);
    return res.data;
  };

  // ✅ Login
  const login = async (formData) => {
    const res = await api.post("/auth/login", formData);

    if (res.data.success && res.data.token) {
      // save token in localStorage
      localStorage.setItem("token", res.data.token);
    }

    setUser(res.data.user);
    return res.data;
  };

  // ✅ Logout
  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    localStorage.removeItem("token"); // remove token on logout
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
