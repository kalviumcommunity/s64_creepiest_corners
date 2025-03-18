// backend/routes/postRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const router = express.Router();

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

// Endpoint for uploading media
router.post('/upload', upload.single('media'), async (req, res) => {
  try {
    const { userId } = req.body; // Assuming userId is sent from the frontend
    const mediaUrl = req.file.path;
    const mediaType = req.file.mimetype.startsWith('image') ? 'image' : 'video';

    const newPost = new Post({ userId, mediaUrl, mediaType });
    await newPost.save();

    res.status(201).json({ message: 'Media uploaded successfully', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading media', error });
  }
});

module.exports = router;