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
  },
  ratedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: String,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model("Video", VideoSchema);
