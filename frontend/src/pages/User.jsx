import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import axios from "axios";
import { BACKEND_URL } from "../constants/url";
import { useEffect, useState } from "react";

function User() {
  const [message, setMessage] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setUser(null);
      navigate("/");
      return;
    }
    async function getUserMessage() {
      try {
        const res = await axios.get(`${BACKEND_URL}/user/welcome`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMessage(res.data.message);
      } catch (e) {
        console.error(e?.response?.data?.message);
        if (!e.response) {
          console.error("Network error ocurred");
          return;
        }
        if (e?.response.status === 401 || e?.response.status === 403) {
          setUser(null);
          localStorage.removeItem("accessToken");
          console.error("Invalid or expired token");
          navigate("/");
          return;
        }
      }
    }
    getUserMessage();
  }, []);
  return (
    <div>
      {message ? <p>{message}</p> : ""}
      <p>
        You are logged in and your token is still not expired if you are able to
        access this page
      </p>
      <p>
        Go back <Link to="/">Home</Link>
      </p>
      <p>
        You will be able to access <Link to="/admin">Admin</Link>, if you are an
        admin
      </p>
    </div>
  );
}

export default User;
