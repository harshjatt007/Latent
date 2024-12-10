const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
//const cloudinary = require("../config/cloudinary");
const { uploadVideo } = require("../controllers/videoController");
const { verifyToken } = require("../middleware/verifyToken");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: 'uploads',
      resource_type: 'auto',
  }
});

const upload = multer({ storage: storage, limits: { fileSize: 10000000 } });

router.post('/fileupload', upload.single('uploadfile'), async (req, res) => {
  console.log("file:",req.file.path);
  res.status(200).send(req.file.path);
});

//router.post("/", verifyToken, upload.single("video"), uploadVideo);

module.exports = router;