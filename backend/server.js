const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const postRoutes = require('./postRoutes');

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'creepiest-corners-secret-key';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true // Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(cookieParser());

// Database connection
require('./database/database')();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Serve static files from the frontend's dist directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// For any other route, serve index.html (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Use post routes
app.use('/api', postRoutes);

// Define a User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, unique: true, sparse: true },
  displayName: { type: String },
  bio: { type: String },
  profilePicture: { type: String, default: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131' },
  coverPhoto: { type: String, default: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ✅ Registration Endpoint
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(201).json({ message: 'Registration successful', user: { email: newUser.email } });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Get token from cookies or Authorization header
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// ✅ Login Endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({ 
      message: 'Login successful', 
      user: { email: user.email }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Logout Endpoint
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// ✅ Protected Route Example (NEW)
app.get('/api/protected', verifyToken, async (req, res) => {
  try {
    // User information is available in req.user
    res.json({ message: 'This is a protected route', user: req.user });
  } catch (error) {
    console.error('Error accessing protected route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Health Check Endpoint (NEW)
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is healthy' });
});


// ✅ Get User Profile Endpoint
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Count posts for this user
    const postCount = await mongoose.model('Post').countDocuments({ userId });
    
    res.json({
      user: {
        ...user.toObject(),
        stats: {
          posts: postCount,
          followers: user.followers ? user.followers.length : 0,
          following: user.following ? user.following.length : 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Update User Profile Endpoint
app.put('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, displayName, bio, profilePicture, coverPhoto } = req.body;
    
    // Check if username is already taken
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          username: username || undefined,
          displayName: displayName || undefined,
          bio: bio || undefined,
          profilePicture: profilePicture || undefined,
          coverPhoto: coverPhoto || undefined
        } 
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      message: 'Profile updated successfully', 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});