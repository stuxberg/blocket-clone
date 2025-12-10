import { Link } from "react-router-dom";
import "../css/Navbar.css";
import { useAuthContext } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuthContext();
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          blocket
        </Link>
        <div className="navbar-menu">
          <Link to="/favorites" className="navbar-item">
            <span className="navbar-icon">🔔</span>
            <span className="navbar-text">Favorites</span>
          </Link>
          <Link to="/create" className="navbar-item">
            <span className="navbar-icon">➕</span>
            <span className="navbar-text">Ny annons</span>
          </Link>
          <Link to="/messages" className="navbar-item">
            <span className="navbar-icon">💬</span>
            <span className="navbar-text">Meddelanden</span>
          </Link>

          {!user ? (
            <Link to="/login" className="navbar-item navbar-login">
              <span className="navbar-icon">👤</span>
              <span className="navbar-text">Logga in</span>
            </Link>
          ) : (
            <Link to="/my-page" className="navbar-item navbar-login">
              <span className="navbar-icon">👤</span>
              <span className="navbar-text">Mitt blocket</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
