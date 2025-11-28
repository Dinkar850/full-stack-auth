import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const userObj = {
      username,
      email,
      password,
      role,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        userObj
      );
      setMessage(response?.data?.message);
      setSuccess(response?.data?.success);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (e) {
      setMessage(e?.response?.data?.message || "Something went wrong");
      setSuccess(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          required
          style={{ display: "block" }}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          style={{ display: "block" }}
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          required
          style={{ display: "block" }}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <select
          value={role}
          style={{ display: "block" }}
          name="role"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
      {message ? (
        <p style={{ color: success ? "green" : "red" }}>{message}</p>
      ) : (
        ""
      )}
    </>
  );
}

export default Register;
