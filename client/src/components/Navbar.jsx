import { Link } from "react-router-dom";
import "../css/Navbar.css";
import { useAuthContext } from "../context/AuthContext";
import { useMessagesContext } from "../context/MessagesContext";

function Navbar() {
  const { user } = useAuthContext();
  const { totalUnreadCount } = useMessagesContext();

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
          <Link to="/messages" className="navbar-item navbar-messages">
            <span className="navbar-icon">💬</span>
            <span className="navbar-text">Meddelanden</span>
            {totalUnreadCount > 0 && (
              <span className="navbar-badge">{totalUnreadCount}</span>
            )}
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
