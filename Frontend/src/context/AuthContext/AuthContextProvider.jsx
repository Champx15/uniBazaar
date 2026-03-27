import { useState, useEffect } from "react";
import authService from "../../service/authService";
import userService from "../../service/userService";
import AuthContext from "./AuthContext";

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, pass) => {
    try {
      await authService.login({ email, pass });
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
      return { success: true, user: currentUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };
  const googleAuth = async (token) => {
    try {
      await authService.googleAuth(token);
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
      return { success: true, user: currentUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser, googleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
