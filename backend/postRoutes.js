// backend/routes/postRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const Post = require('./Post');
const { ObjectId } = require('mongoose').Types;
const router = express.Router();

// Define JWT secret consistently with server.js
const JWT_SECRET = process.env.JWT_SECRET || 'creepiest-corners-secret-key';

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
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

// Endpoint for uploading media
router.post('/upload', verifyToken, upload.single('media'), async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from the token
    const { content } = req.body; // Get content from request body
    // Use full URL for media files to ensure they display correctly in frontend
    const mediaUrl = `http://localhost:8000/${req.file.path}`;
    const mediaType = req.file.mimetype.startsWith('image') ? 'image' : 'video';

    const newPost = new Post({ 
      userId, 
      content: content || '', 
      mediaUrl, 
      mediaType,
      likes: [],
      comments: []
    });
    await newPost.save();

    res.status(201).json({ message: 'Media uploaded successfully', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading media', error });
  }
});

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});

// Get posts by user ID
router.get('/posts/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user posts', error });
  }
});

// Like/unlike a post
router.post('/posts/:postId/like', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already liked the post
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike the post
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // Like the post
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ 
      message: alreadyLiked ? 'Post unliked' : 'Post liked',
      likes: post.likes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error liking/unliking post', error });
  }
});

// Add a comment to a post
router.post('/posts/:postId/comment', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      userId,
      text,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ 
      message: 'Comment added successfully',
      comment: newComment,
      commentCount: post.comments.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
});

module.exports = router;