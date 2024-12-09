const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { uploadVideo } = require("../controllers/videoController");
const { verifyToken } = require("../middleware/verifyToken");

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
    fileSize: 100 * 1024 * 1024, // Max file size 100MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed"), false);
    }
    cb(null, true);
  },
});

router.post("/", verifyToken, upload.single("video"), uploadVideo);

module.exports = router;