const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ["admin", "audience", "participant"],
    default: "participant",
  },
  videos: [String],
  // New fields for admin approval system
  isApproved: {
    type: Boolean,
    default: false,
  },
  approvalRequestPending: {
    type: Boolean,
    default: false,
  },
  requestedRole: {
    type: String,
    enum: ["admin", "audience", "participant"],
    default: "participant",
  },
  // Track which videos this user has rated
  ratedVideos: [{
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    ratedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Track videos uploaded by this user
  uploadedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }]
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;