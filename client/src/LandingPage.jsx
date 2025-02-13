import React from "react";
import "./LandingPage.css";
import background from "./assets/bg.png"; // ✅ Import the local background image

const LandingPage = () => {
  return (
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
        <a href="#explore" className="cta-button">Explore Now</a>
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
  );
};

export default LandingPage;
