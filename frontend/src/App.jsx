import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './Home';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import UploadFormPage from './UploadFormPage';
import LandingPage from './LandingPage';
import SearchPage from './SearchPage';
import ProfilePage from './ProfilePage';
import NotificationsPage from './NotificationsPage';
import { FaHome, FaSearch, FaUser, FaBell, FaSignOutAlt, FaPlus } from 'react-icons/fa';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div style={styles.appContainer}>
      {isAuthenticated && (
          <div style={styles.sidebar}>
            <div style={styles.logo}>
              <h2 style={styles.logoText}>Creepiest Corners</h2>
            </div>
            <nav style={styles.nav}>
              <Link to="/home" style={styles.navItem}>
                <FaHome style={styles.icon} />
                <span style={styles.navText}>Home</span>
              </Link>
              <Link to="/search" style={styles.navItem}>
                <FaSearch style={styles.icon} />
                <span style={styles.navText}>Search</span>
              </Link>
              <Link to="/profile" style={styles.navItem}>
                <FaUser style={styles.icon} />
                <span style={styles.navText}>Profile</span>
              </Link>
              <Link to="/notifications" style={styles.navItem}>
                <FaBell style={styles.icon} />
                <span style={styles.navText}>Notifications</span>
              </Link>
              <Link to="/upload" style={styles.navItem}>
                <FaPlus style={styles.icon} />
                <span style={styles.navText}>Post</span>
              </Link>
              <button onClick={handleLogout} style={styles.logoutButton}>
                <FaSignOutAlt style={styles.icon} />
                <span style={styles.navText}>Logout</span>
              </button>
            </nav>
          </div>
        )}

        <div style={isAuthenticated ? styles.mainContent : styles.fullContent}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={!isAuthenticated ? <LoginPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/home" replace={false} />} />
            <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/home" replace={false} />} />
            
            {/* Protected routes */}
            <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace={false} />} />
            <Route path="/search" element={isAuthenticated ? <SearchPage /> : <Navigate to="/login" replace={false} />} />
            <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace={false} />} />
            <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" replace={false} />} />
            <Route path="/upload" element={isAuthenticated ? <UploadFormPage /> : <Navigate to="/login" replace={false} />} />
          </Routes>
        </div>
      </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#121212',
    color: '#e0e0e0',
  },
  sidebar: {
    width: '250px',
    borderRight: '1px solid #333',
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    padding: '0 20px',
    marginBottom: '30px',
  },
  logoText: {
    margin: 0,
    color: '#ff4757',
    fontSize: '28px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    color: '#e0e0e0',
    textDecoration: 'none',
    fontSize: '18px',
    marginBottom: '10px',
    borderRadius: '30px',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#333',
    },
  },
  icon: {
    marginRight: '15px',
    fontSize: '20px',
  },
  navText: {
    fontSize: '18px',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    color: '#e0e0e0',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    marginTop: 'auto',
    borderRadius: '30px',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#333',
    },
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    height: '100vh', // Ensure the container takes full viewport height
    maxHeight: '100vh', // Limit height to viewport
  },
  fullContent: {
    flex: 1,
    width: '100%',
    overflowY: 'auto', // Enable scrolling for full content as well
    height: '100vh', // Ensure the container takes full viewport height
  },
};

export default App;
