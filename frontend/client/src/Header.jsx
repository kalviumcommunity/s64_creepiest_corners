import React from "react";
import "./index.css";

const Header = () => {
  return (
    <nav className="navbar">
      <h2>The Creepiest Corners</h2>
      <ul>
        <li><a href="#explore">Explore</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Header;
