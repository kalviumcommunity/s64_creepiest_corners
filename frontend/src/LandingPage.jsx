import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import background from "./assets/bg3.png"; // Ensure the image path is correct

const LandingPage = () => {
  const [isVerified, setIsVerified] = useState(false); // Set to false to show age verification popup
  const navigate = useNavigate();

  const handleVerification = (isAllowed) => {
    if (isAllowed) {
      setIsVerified(true);
    } else {
      alert("Access Denied. You must be 18+ to access this website.");
    }
  };

  return (
    <>
      {!isVerified ? (
        <div className="age-verification-popup">
          <div className="popup-content">
            <h2>Age Verification</h2>
            <p>Are you 18 years or older?</p>
            <div className="button-container">
              <button onClick={() => handleVerification(true)}>Yes, I am 18+</button>
              <button onClick={() => handleVerification(false)}>No, I am under 18</button>
            </div>
          </div>
        </div>
      ) : (
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
            <button className="cta-button" onClick={() => navigate("/login")}>
              Explore Now
            </button>
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



// import React, { useEffect, useState } from 'react';
// import './LandingPage.css';

// function LandingPage() {
//   // State to store the entities fetched from the backend
//   const [entities, setEntities] = useState([]);

//   // Fetch entities from the backend when the component mounts
//   useEffect(() => {
//     fetch('http://localhost:3000/api/entities')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         setEntities(data); // Set the fetched data to the state
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }, []); // Empty dependency array ensures this runs only once on mount

//   return (
//     <div className="landing-page">
//       <h1>Welcome to the Landing Page</h1>
//       <h2>Entities List</h2>
//       {entities.length > 0 ? (
//         <div className="entities-container">
//           {entities.map(entity => (
//             <div key={entity.id} className="entity-card">
//               <h3>{entity.name}</h3>
//               <p>{entity.description}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No entities found.</p>
//       )}
//     </div>
//   );
// }

// export default LandingPage;
