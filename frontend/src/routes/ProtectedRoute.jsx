import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../constants/url";
import { useAuth } from "../contexts/AuthProvider";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [valid, setValid] = useState(null);
  const { setUser } = useAuth();
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
        const res = await axios.get(`${BACKEND_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setValid(res?.data?.success);
      } catch (e) {
        //in case of network error -> e.response is undefined
        if (!e.response) {
          console.error("Network error. Unable to validate user.");
          return;
        }

        // token invalid / EXPIRED
        if (e.response.status === 401 || e.response.status === 403) {
          console.error("Token invalid or expired. Logging out...");
          localStorage.removeItem("accessToken");
          setUser(null);
          setValid(false);
          return;
        }
      }
    }
    validateUser();
  }, []);
  if (valid === false) return <Navigate to="/" replace />;
  else if (valid === null) return <p>Loading...</p>;
  return children;
}

export default ProtectedRoute;
