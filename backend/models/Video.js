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
    type: [Number],
  }
});

module.exports = mongoose.model("Video", VideoSchema);
