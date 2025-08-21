import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // login user data
  const [loading, setLoading] = useState(true);

  // ✅ Current user fetch (backend /me)
  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
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
    setUser(res.data.user);
    return res.data;
  };

  // ✅ Logout
  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
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
