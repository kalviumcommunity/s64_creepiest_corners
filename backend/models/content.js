// models/Content.js
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  description: { type: String, required: true },
  video: { type: String, required: true },
  photo: { type: String, required: true },
});

module.exports = mongoose.model('Content', contentSchema);