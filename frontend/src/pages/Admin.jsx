import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants/url";

function Admin() {
  const { setUser } = useAuth();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setUser(null);
      navigate("/");
      return;
    }
    async function getAdminMessage() {
      try {
        const res = await axios.get(`${BACKEND_URL}/admin/welcome`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setMessage(res.data.message);
      } catch (e) {
        //network error
        if (!e.response) {
          console.error("Network error");
          return;
        }

        //invalid token
        if (e.response.data.type === "invalid_token") {
          console.error("Token expired or invalid");
          localStorage.removeItem("accessToken");
          setUser(null);
          navigate("/");
        }

        //invalid role
        if (e.response.data.type === "invalid_role") {
          console.error("Only admins are authorized to access this route");
          navigate("/user");
        }
      }
    }
    getAdminMessage();
  }, []);
  return (
    <div>
      {message ? <p>{message}</p> : ""}
      <p>
        Go back <Link to="/">Home</Link>
      </p>
      <p>
        Go back <Link to="/user">User</Link>
      </p>
    </div>
  );
}

export default Admin;
