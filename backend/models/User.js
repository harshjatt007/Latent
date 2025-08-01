const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    unique: true
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
  videos: [String]
});

const User = mongoose.model("User", userSchema);

module.exports = User;