import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text(); // Get raw response

      try {
        const data = JSON.parse(text); // Try parsing as JSON

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        alert(`Login successful! Welcome, The world of creep hails you!`);
      } catch (error) {
        console.error('Response was not JSON:', text);
        alert('Unexpected response from server. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="options">
          <label>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            Remember me
          </label>
          <a href="#" className="forgot-password">Forgot password?</a>
        </div>

        <button type="submit" className="login-button">Sign In</button>
      </form>

      <p className="signup-text">
        Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
