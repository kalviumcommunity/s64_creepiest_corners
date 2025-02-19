import React, { useState } from "react";
import "./LandingPage.css";
import background from "./assets/bg3.png"; // Ensure this path is correct

const LandingPage = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);

  const handleYesClick = () => {
    setAccessGranted(true);
    setShowPopup(false);
  };

  const handleNoClick = () => {
    alert("Access Denied. You must be 18+ to access this website.");
    setShowPopup(false);
  };

  return (
    <>
      {/* Age Verification Pop-Up */}
      {showPopup && (
        <div className="age-verification-popup">
          <div className="popup-content">
            <h2>Age Verification</h2>
            <p>Are you 18 years or older?</p>
            <div className="button-container">
              <button onClick={handleYesClick}>Yes, I am 18+</button>
              <button onClick={handleNoClick}>No, I am under 18</button>
            </div>
          </div>
        </div>
      )}

      {/* Landing Page Content */}
      {accessGranted && (
        <div
          className="landing-container"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "100vh",
          }}
        >
          <header className="hero-section">
            <h1>Welcome to The Creepiest Corners</h1>
            <p>Discover the strangest and most bizarre parts of the internet.</p>
            <a href="#explore" className="cta-button">
              Explore Now
            </a>
          </header>

          <main className="features-section">
            <div className="features-grid">
              <div className="feature">
                <h2>Curated Oddities</h2>
                <p>Handpicked content tailored to your darkest curiosities.</p>
              </div>
              <div className="feature">
                <h2>AI-Driven Discovery</h2>
                <p>Explore weird internet phenomena personalized for you.</p>
              </div>
              <div className="feature">
                <h2>Community Submissions</h2>
                <p>Share and discuss the strangest finds with others.</p>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default LandingPage;