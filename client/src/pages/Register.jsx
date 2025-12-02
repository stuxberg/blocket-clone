import { useState } from "react";
import { Link } from "react-router-dom";
import { validateRegisterForm } from "../utils/validation";
import "../css/Auth.css";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const { errors, isValid } = validateRegisterForm(formData);
    setFormErrors(errors);

    if (!isValid) {
      return;
    }

    // TODO: Submit form to backend
    console.log("Form is valid, submitting:", formData);
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
              placeholder="Ange din mejladress"
            />
            <p>{formErrors.email}</p>
          </div>

          <div className="form-group">
            <label htmlFor="username">Användarnamn</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ange ditt användarnamn"
            />
            <p>{formErrors.username}</p>
          </div>

          <div className="form-group">
            <label htmlFor="password">Lösenord</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ange ditt lösenord"
            />
            <p>{formErrors.password}</p>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Bekräfta lösenord</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Bekräfta ditt lösenord"
            />
            <p>{formErrors.confirmPassword}</p>
          </div>

          <button
            type="submit"
            className="form-btn"
            disabled={
              !formData.email ||
              !formData.username ||
              !formData.password ||
              !formData.confirmPassword
            }
          >
            Skapa konto
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
