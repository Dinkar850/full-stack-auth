import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axiosInterceptor";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function logout() {
    localStorage.removeItem("accessToken");
    setUser(null);
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No access token present in local storage");
      return;
    }
    async function validateUser() {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (e) {
        const status = e.response?.status;
        if (status !== 401) {
          console.error(e.response?.data?.message);
          return;
        }

        //refreshing token failed, logout the user
        if (status === 401) {
          console.error(
            "Session expired, please login again (refresh token expired)"
          );
          logout();
          return;
        }

        console.error(e.response.data?.message || "Unexpected error");
      }
    }
    validateUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    console.log("Used outside provider");
  }
  return context;
}
