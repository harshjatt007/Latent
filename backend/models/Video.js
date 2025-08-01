const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  aboutPoints: {
    type: [String], // Changed from [Number] to [String] for text descriptions
  },
  ratings: {
    type: [Number], // New field for actual ratings (1-5)
    default: []
  }
});

module.exports = mongoose.model("Video", VideoSchema);
