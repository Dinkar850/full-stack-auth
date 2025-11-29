import { useEffect, useState } from "react";
import { BACKEND_URL } from "../constants/url";
import { useAuth } from "../contexts/AuthProvider";
import { Navigate } from "react-router-dom";
import api from "../utils/axiosInterceptor";

function ProtectedRoute({ children }) {
  const [valid, setValid] = useState(null);
  const { setUser, logout } = useAuth();
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setValid(false);
      setUser(null);
      console.error("not authorized to access this route");
      return;
    }
    async function validateUser() {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
        setValid(true);
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
          setValid(false);
          logout();
          return;
        }

        console.error(e.response.data?.message || "Unexpected error");
      }
    }
    validateUser();
  }, []);
  if (valid === false) return <Navigate to="/" replace />;
  else if (valid === null) return <p>Loading...</p>;
  return children;
}

export default ProtectedRoute;
