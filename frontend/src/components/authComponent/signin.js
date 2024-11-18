import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "../../styles/auth/signin/signin.css";

export default function Signin({ currentUser, setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:9000/api/v1/login/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.user.role);
        if (data.role === "user") {
          history.push("/Main");
        } else if (data.user.role === "Admin") {
          history.push("/Admin");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signin-container">
      <h2 className="signin-title">Sign In</h2>
      <form className="signin-form" onSubmit={submitHandler}>
        <label className="signin-label" htmlFor="email">
          Email:
        </label>
        <input
          type="email"
          className="signin-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="signin-label" htmlFor="password">
          Password:
        </label>
        <input
          type="password"
          className="signin-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="signin-button" type="submit">
          Sign In
        </button>

        <p className="signin-text">
          Don't have an account?{" "}
          <Link to="/signup" className="signin-link">
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  );
}
