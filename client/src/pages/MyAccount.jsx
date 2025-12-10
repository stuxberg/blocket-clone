import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getUserProfile } from "../services/userAPI";
import { useAuthContext } from "../context/AuthContext";
import "../css/MyAccount.css";

function MyAccount() {
  const { user: authUser } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProfile();
      setProfile(data.user);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">Loading...</div>
      </>
    );
  }

  if (error && !profile) {
    return (
      <>
        <Navbar />
        <div className="error-container">{error}</div>
      </>
    );
  }

  return (
    <div className="my-account">
      <Navbar />
      <div className="my-account-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/my-page">Mitt Blocket</Link>
          <span>/</span>
          <span>Mitt konto</span>
        </nav>

        {/* Title */}
        <h1 className="page-title">Hej {authUser?.username}!</h1>
        <p className="page-description">
          Din profil på Blocket är sammanställd från information som har hämtats
          från dina konton på både Blocket och Vend. Ju mer information du
          lägger till här, desto mer kan vi anpassa Blocket till dig.{" "}
          <a href="#" className="learn-more-link">
            Läs mer om Vend-konto
          </a>
        </p>

        {/* Blocket Account Details */}
        <section className="account-section">
          <h2 className="section-title">Blocket kontodetaljer</h2>

          <div className="profile-picture-section">
            <img
              src={profile?.profilePicture}
              alt="Profile"
              className="profile-picture"
            />
            <button className="change-picture-btn">
              <span className="icon">📷</span> Ändra
            </button>
          </div>

          <div className="form-group">
            <label>Berätta om dig själv</label>
            <textarea
              placeholder="Skriv något om dig själv, så andra vet vem de handlar med."
              className="bio-textarea"
              maxLength={500}
              disabled
            />
            <p className="char-count">
              Beskrivningen får inte innehålla telefonnummer, mejladresser eller
              länkar. Högst 500 tecken.
            </p>
          </div>
        </section>

        {/* Vend Settings */}
        <section className="account-section">
          <h2 className="section-title">Vend-inställningar</h2>

          <div className="info-row">
            <label>Mejladress:</label>
            <span>{profile?.email}</span>
            <button className="edit-icon-btn">✏️</button>
          </div>

          <div className="info-row">
            <label>Lösenord:</label>
            <span>••••••••</span>
            <button className="edit-icon-btn">✏️</button>
          </div>

          <div className="info-row">
            <label>Mobilnummer:</label>
            <span>Inte angivet</span>
            <button className="edit-icon-btn">✏️</button>
          </div>
        </section>

        {/* About You */}
        <section className="account-section">
          <h2 className="section-title">Om dig</h2>

          <div className="info-row">
            <label>Namn:</label>
            <span>Inte angivet</span>
          </div>
          <div className="info-row">
            <label>Visningsnamn:</label>
            <span>{profile?.username}</span>
          </div>
          <div className="info-row">
            <label>Födelseår:</label>
            <span>Inte angivet</span>
          </div>
          <div className="info-row">
            <label>Kön:</label>
            <span>Inte angivet</span>
          </div>
          <button className="edit-btn-text">✏️ Redigera</button>
        </section>
      </div>
    </div>
  );
}

export default MyAccount;
