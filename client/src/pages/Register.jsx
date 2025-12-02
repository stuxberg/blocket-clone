import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Auth.css";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <main className="main">
        <div className="img-container">
          <img
            src="https://d2ejn7vyb2fbnr.cloudfront.net/clients/images/logos/680f71d5c7b4122547861e44_680f76ed62510.png"
            alt="Blocket"
            title="Blocket"
            className="blocket-picture"
          ></img>
        </div>
        <div className="info-login">
          <h2>Skapa ett konto</h2>
          <p>Fortsätt till Blocket</p>
        </div>

        <form className="form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="email">Mejladress</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Användarnamn</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Lösenord</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="form-btn"
            disabled={
              !formData.email || !formData.username || !formData.password
            }
          >
            Register
          </button>
        </form>

        <p className="auth-link">
          <strong>Har du redan ett konto?</strong>{" "}
          <Link to={"/login"}>Logga in</Link>
        </p>
      </main>
    </div>
  );
}

export default Register;
