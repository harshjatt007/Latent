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
    type: [String],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Video", VideoSchema);
