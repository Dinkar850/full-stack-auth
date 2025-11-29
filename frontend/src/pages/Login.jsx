import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import api from "../utils/axiosInterceptor";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(true);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    const userBody = {
      username,
      password,
    };

    try {
      const response = await api.post(
        "http://localhost:3000/api/auth/login",
        userBody
      );
      localStorage.setItem("accessToken", response?.data?.accessToken);
      setMessage(response?.data?.message);
      setSuccess(response?.data?.success);
      setUser(response?.data?.user);
      setTimeout(() => {
        navigate("/");
      }, 750);
    } catch (e) {
      console.log(e.message);
      setSuccess(false);
      setMessage(e.response?.data?.message);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          value={username}
          required
          style={{ display: "block" }}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="password"
          required
          style={{ display: "block" }}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button type="submit">Login</button>
      </form>
      {message ? (
        <p style={{ color: success ? "green" : "red" }}>{message}</p>
      ) : (
        ""
      )}
    </>
  );
}

export default Login;
