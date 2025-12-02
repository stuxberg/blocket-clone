import React from "react";
import Navbar from "../components/Navbar";
import "../css/Mypage.css";

function Mypage() {
  return (
    <>
      <div className="mypage">
        <Navbar />
        <div className="page-container">
          <div className="info-section">
            <div className="info-section-nav">
              <h1>Mitt Blocket</h1>
              <a href="http://">Logga ut</a>
            </div>
            <div className="info-section-about">
              <img
                class="w-128 h-128 rounded-full max-w-none"
                src="https://images.blocketcdn.se/dynamic/220x220c/profile_placeholders/default"
                alt="Profilbild för Albin"
              ></img>
              <div className="info-section-credentials">
                <h2>USER</h2>
                <div>albin.stuxberg@gmail.com</div>
                <div className="info-section-credentials-reviews">
                  <div class="flex rounded-full items-center rounded-20 p-0 justify-center min-h-[30px] min-w-[30px] s-bg-primary s-text-inverted text-caption font-bold">
                    10
                  </div>
                  <a
                    href="/my-reviews"
                    aria-details="my-reviews-highlight"
                    class="review-amount"
                  >
                    1 omdöme
                  </a>
                </div>
                <a
                  href="/profile/ads?userId=781437496"
                  class="show-profile"
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
                      class="w-128 h-128 rounded-full max-w-none"
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
                      class="w-128 h-128 rounded-full max-w-none"
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
                      class="w-128 h-128 rounded-full max-w-none"
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
