import React from "react";
import "../css/Auth.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";
const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      const res = await register(formData);
      const data = await res.json();

      if (data.success) {
        setMessage("Account created! Redirecting...");

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500); // 1.5 seconds delay
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.log(error);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container">
      <main className="main">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="form-btn">
            Signup
          </button>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          {message && (
            <p role="alert" className="error">
              {message}
            </p>
          )}
        </form>

        <p className="auth-link">
          Already have an account? <Link to={"/login"}>Login Here</Link>
        </p>
      </main>
    </div>
  );
};

export default Signup;
