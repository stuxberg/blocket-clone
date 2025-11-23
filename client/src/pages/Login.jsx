import React, { useState } from "react";

import "../css/Auth.css";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      const data = await login(formData);

      if (data.success) {
        navigate("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <main className="main">
        <form className="form" onSubmit={handleLogin}>
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
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="form-btn">
            Login
          </button>
        </form>

        <p className="auth-link">
          Dont have an account? <Link to={"/register"}>Register Here</Link>
        </p>

        <p>{error}</p>
      </main>
    </div>
  );
};

export default Login;
