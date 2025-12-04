import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateLoginForm } from "../utils/validation";
import "../css/Auth.css";
import { useAuthContext } from "../context/AuthContext";
import { loginApi } from "../services/authAPI";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { errors, isValid } = validateLoginForm(formData);
    setFormErrors(errors);

    if (!isValid) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await loginApi(formData);
      login(data.accessToken, data.user);
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
    }
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
          <h2>Logga in</h2>
          <p>Fortsätt till Blocket.</p>
        </div>

        <form className="form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Mejladdress:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ange din mailaddress"
            />
            <p>{formErrors.email}</p>
          </div>

          <div className="form-group">
            <label htmlFor="password">Lösenord:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ange ditt lösenord"
            />
            <p>{formErrors.password}</p>
          </div>

          <button
            type="submit"
            className="form-btn"
            disabled={!formData.email || !formData.password}
          >
            Logga in
          </button>

          {error && <p>{error}</p>}
        </form>

        <p className="auth-link">
          <strong>Inte registrerat dig ännu?</strong>{" "}
          <Link to={"/register"}>Skapa ett konto</Link>
        </p>
      </main>
    </div>
  );
}

export default Login;
