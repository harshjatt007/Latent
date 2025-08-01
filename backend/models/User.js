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
  roleStatus: {
    type: String,
    enum: ["approved", "pending", "rejected"],
    default: "approved",
  },
  requestedRole: {
    type: String,
    enum: ["admin", "audience", "participant"],
    default: null,
  },
  videos: [String]
});

const User = mongoose.model("User", userSchema);

module.exports = User;