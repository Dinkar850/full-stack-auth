import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

function Home() {
  const { user, setUser } = useAuth();
  function handleLogout() {
    localStorage.removeItem("accessToken");
    setUser(null);
  }

  return (
    <>
      {user ? (
        <div>
          <p>User: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <button onClick={handleLogout}>Logout</button>
          <p>
            Go to <Link to="/user">user</Link> page
          </p>
        </div>
      ) : (
        <div>
          <p>
            Welcome to our App, New here? Register:{" "}
            <Link to="/register">Register</Link>
          </p>
          <p>
            Already registered? <Link to="/login">Login</Link>
          </p>
        </div>
      )}
    </>
  );
}

export default Home;
