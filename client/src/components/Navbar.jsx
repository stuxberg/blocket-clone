import { Link } from "react-router-dom";
import "../css/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          blocket
        </Link>
        <div className="navbar-menu">
          <button className="navbar-item">
            <span className="navbar-icon">🔔</span>
            <span className="navbar-text">Notiser</span>
          </button>
          <button className="navbar-item">
            <span className="navbar-icon">➕</span>
            <span className="navbar-text">Ny annons</span>
          </button>
          <button className="navbar-item">
            <span className="navbar-icon">💬</span>
            <span className="navbar-text">Meddelanden</span>
          </button>
          <Link to="/login" className="navbar-item navbar-login">
            <span className="navbar-icon">👤</span>
            <span className="navbar-text">Logga in</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
