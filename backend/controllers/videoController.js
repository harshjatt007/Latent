const uploadVideo = async (req, res) => {
  console.log(req.file);
  console.log(req.body);
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const videoUrl = req.file.path; // URL of the uploaded video in Cloudinary
    const userId = req.user.userId; // Extract userId from the decoded token

    // Save video URL and associated user in the database (assuming you have a Video model)
    const newVideo = new Video({
      userId,
      videoUrl,
      // Additional fields such as video metadata (name, description, etc.)
    });

    await newVideo.save();

    res.status(200).json({ message: "Video uploaded successfully", videoUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading video" });
  }
};

module.exports = { uploadVideo };