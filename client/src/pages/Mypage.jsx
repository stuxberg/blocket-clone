import React from "react";
import Navbar from "../components/Navbar";
import "../css/Mypage.css";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Mypage() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate("/");
    await logout();
  };
  return (
    <>
      <div className="mypage">
        <Navbar />
        <div className="page-container">
          <div className="info-section">
            <div className="info-section-nav">
              <h1>Mitt Blocket</h1>
              <button onClick={handleLogout} className="logout-button">
                Logga ut
              </button>
            </div>
            <div className="info-section-about">
              <img
                className="w-128 h-128 rounded-full max-w-none"
                src="https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default"
                alt="Profilbild för Albin"
              ></img>
              <div className="info-section-credentials">
                <h2>{user.username}</h2>
                <div>{user.email}</div>
                <div className="info-section-credentials-reviews">
                  <div className="flex rounded-full items-center rounded-20 p-0 justify-center min-h-[30px] min-w-[30px] s-bg-primary s-text-inverted text-caption font-bold">
                    10
                  </div>
                  <a
                    href="/my-reviews"
                    aria-details="my-reviews-highlight"
                    className="review-amount"
                  >
                    1 omdöme
                  </a>
                </div>
                <a
                  href="/profile/ads?userId=781437496"
                  className="show-profile"
                  role="button"
                >
                  Visa profil
                </a>
              </div>
            </div>
          </div>

          <nav className="nav">
            <div className="box">
              <div className="box-card">
                <div className="box-container">
                  <div className="box-title">
                    <img
                      className="w-128 h-128 rounded-full max-w-none"
                      src="https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default"
                      alt="Profilbild för Albin"
                    ></img>
                    <h3>Mitt konto</h3>
                  </div>
                  <div className="box-info">
                    Se dina kontouppgifter på Blocket och Vend
                  </div>
                </div>
              </div>
              <div className="box-card">
                <div className="box-container">
                  <div className="box-title">
                    <img
                      className="w-128 h-128 rounded-full max-w-none"
                      src="https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default"
                      alt="Profilbild för Albin"
                    ></img>
                    <h3>Mina annonser</h3>
                  </div>
                  <div className="box-info">
                    Se dina kontouppgifter på Blocket och Vend
                  </div>
                </div>
              </div>
              <div className="box-card">
                <div className="box-container">
                  <div className="box-title">
                    <img
                      className="w-128 h-128 rounded-full max-w-none"
                      src="https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default"
                      alt="Profilbild för Albin"
                    ></img>
                    <h3>Favoriter</h3>
                  </div>
                  <div className="box-info">
                    Se dina kontouppgifter på Blocket och Vend
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Mypage;
