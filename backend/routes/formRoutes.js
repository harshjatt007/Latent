const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const Video = require("../models/Video");

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "videos",
    resource_type: "video",
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed"), false);
    }
    cb(null, true);
  },
});

router.post("/", upload.single("video"), async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const { name, address, age, rating, aboutPoints } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No video file uploaded" });
    }

    const newVideo = new Video({
      name,
      address,
      age,
      rating,
      videoUrl: req.file.path,
      aboutPoints: JSON.parse(aboutPoints),
    });

    await newVideo.save();

    res.status(201).json({
      message: "Form submitted successfully!",
      video: newVideo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error submitting form" });
  }
});

module.exports = router;
