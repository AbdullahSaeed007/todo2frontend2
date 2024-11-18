import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/auth/signup/signup.css";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup({ setUsersu, usersu }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function submitHandler(e) {
    e.preventDefault();

    try {
      // Send a POST request to the backend signup API
      const response = await fetch(
        "http://localhost:9000/api/v1/register/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
          credentials: "include", // Allows cookies to be set for JWT
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setUsersu((prev) => [...prev, data.user]);

        toast.success("successfully created", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide, 
        });

      } else {
        console.log(data.message);
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred. Please try again.");
    }
  }

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      <form className="signup-form" onSubmit={submitHandler}>
        <label className="signup-label" htmlFor="username">
          Username:
        </label>
        <input
          type="text"
          className="signup-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label className="signup-label" htmlFor="email">
          Email:
        </label>
        <input
          type="email"
          className="signup-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="signup-label" htmlFor="password">
          Password:
        </label>
        <input
          type="password"
          className="signup-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="signup-button" type="submit">
          Sign Up
        </button>
        <p className="signup-text">
          Already have an account?{" "}
          <Link to="/signin" className="signup-link">
            Sign in here
          </Link>
        </p>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide} // No colon here
      />
    </div>
  );
}
