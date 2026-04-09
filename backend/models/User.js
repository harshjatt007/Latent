const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
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
    default: "",
  },
  bio: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ["user", "contestant", "admin"],
    default: "user",
  },
  videos: [String]
});

const User = mongoose.model("User", userSchema);

module.exports = User;