import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './LoginPage.css';

const LoginPage = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error message
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    setError(''); // Clear previous errors

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const text = await response.text(); // Get raw response

      try {
        const data = JSON.parse(text); // Try parsing as JSON

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        // Login successful
        alert(`Login successful! Welcome, The world of creep hails you!`);

        // Save token or user data to localStorage (optional)
        console.log('Saving token to localStorage:', data.token);
        localStorage.setItem('token', data.token); // Example: Save token
        
        // Verify token was saved correctly
        const savedToken = localStorage.getItem('token');
        console.log('Token retrieved from localStorage:', savedToken);
        
        // Update authentication state
        setIsAuthenticated(true);

        // Redirect to the home page
        navigate('/home');
      } catch (error) {
        console.error('Response was not JSON:', error);
        setError('Unexpected response from server. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>

      {error && <p className="error-message">{error}</p>} {/* Display error message */}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading} // Disable input while loading
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
            disabled={loading} // Disable input while loading
          />
        </div>

        <div className="options">
          <label>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={loading} // Disable checkbox while loading
            />
            Remember me
          </label>
          <a href="#" className="forgot-password">Forgot password?</a>
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'} {/* Show loading text */}
        </button>
      </form>

      <p className="signup-text">
        Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginPage;