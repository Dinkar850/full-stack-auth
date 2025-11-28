import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { BACKEND_URL } from "../constants/url";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return;
    }

    async function getUser() {
      try {
        const response = await axios.get(`${BACKEND_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response?.data);
      } catch (e) {
        // network error → e.response is undefined
        if (!e.response) {
          console.error("network error. Unable to validate user.");
          return;
        }

        // token invalid / expired
        if (e.response.status === 401 || e.response.status === 403) {
          console.error("Token invalid or expired. Logging out...");
          localStorage.removeItem("accessToken");
          setUser(null);
          return;
        }
      }
    }

    getUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
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
