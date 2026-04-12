const express = require('express');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/formRoutes');
const contactRoutes = require('./routes/contactRoutes');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');
const Razorpay = require('razorpay');
require('dotenv').config();
const app = express();
const cors = require('cors');
const User = require('./models/User');
const Video = require('./models/Video');

const multer = require("multer");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://latent-u5prcrsl0-abhishek1161be22-chitkaraedus-projects.vercel.app',
  'https://latent-delta.vercel.app',
  'https://latent-kk5m.onrender.com',
  // Add more Vercel deployment URLs as needed
  /^https:\/\/.*\.vercel\.app$/,
  /^https:\/\/latent.*\.vercel\.app$/
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS origin check:", origin);
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin || origin.startsWith(allowedOrigin);
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (allowed) {
      callback(null, true);
    } else {
      console.error("CORS origin rejected:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
};

// Enable CORS
app.use(cors(corsOptions));
app.use('/uploads', express.static('uploads'));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Connect to MongoDB
connectDB();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const fs = require('fs');
const path = require('path');
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const isLocalAuth = !process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your-cloudinary-cloud-name';
const storage = isLocalAuth ? multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
  }
}) : new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    resource_type: 'auto',
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50000000 },
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only videos are allowed!'), false);
    }
  }
});
app.post('/fileupload', upload.single('uploadfile'), async (req, res) => {
  console.log("file:", req.file ? req.file.path : 'no file found');
  console.log(req.body);
  
  const nowTime = new Date();
  const currentHour = nowTime.getHours();
  // Upload allowed 12:00 AM to 10:00 PM
  if (currentHour >= 22) {
     return res.status(400).json({ success: false, error: 'Uploads are closed for today. Contest window is 12:00 AM to 10:00 PM.' });
  }

  const userId = req.body.userId || req.body.id;
  console.log("File upload attempt. UserId in body:", userId);
  if (userId) {
     const startOfToday = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate());
     const existingVideo = await Video.findOne({ 
       uploadedBy: String(userId),
       createdAt: { $gte: startOfToday }
     });
     if (existingVideo) {
         console.log("Blocking double upload. Found video:", existingVideo._id, "for userId:", userId);
         return res.status(400).json({ success: false, error: 'Upload Limit Reached: You can only submit one video per day.' });
     }
  } else {
     console.log("No userId found in upload request body!");
  }
  
  // Create video entry regardless of user existence
  let aboutPoints = [];
  try {
    aboutPoints = JSON.parse(req.body.aboutPoints);
    // Ensure aboutPoints is an array of strings
    if (!Array.isArray(aboutPoints)) {
      aboutPoints = [];
    }
  } catch (error) {
    console.error("Error parsing aboutPoints:", error);
    aboutPoints = [];
  }

  try {
    const videoUrlPath = isLocalAuth && req.file ? `uploads/${req.file.filename}` : (req.file ? req.file.path : '');
    const video = new Video({
      name: req.body.name,
      videoUrl: videoUrlPath,
      address: req.body.address,
      age: parseInt(req.body.age),
      rating: parseInt(req.body.rating),
      aboutPoints: aboutPoints,
      uploadedBy: userId ? String(userId) : null,
      ratings: [] // Initialize empty ratings array
    });
    await video.save();
    console.log("Video saved successfully with ID:", video._id, "UploadedBy:", video.uploadedBy);
    
    res.status(200).json({ 
      success: true, 
      message: 'Video uploaded successfully',
      videoPath: req.file.path,
      videoId: video._id
    });
  } catch (error) {
    console.error("Error saving video:", error);
    res.status(500).json({ 
      success: false, 
      error: 'Error saving video: ' + error.message
    });
  }
});

app.get('/api/check-participation/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("Checking participation query for userId:", userId);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const videos = await Video.find({ uploadedBy: String(userId) });
    console.log("All videos for this user:", videos.length);
    
    const existingVideo = await Video.findOne({ 
       uploadedBy: String(userId),
       createdAt: { $gte: twentyFourHoursAgo }
    });
    
    console.log("Participation check match:", !!existingVideo);
    if (existingVideo) {
      res.status(200).json({ participated: true, videoId: existingVideo._id });
    } else {
      res.status(200).json({ participated: false });
    }
  } catch (error) {
    console.error("Participation check error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post('/allVideos', async (req, res) => {
  try {
    const videos = await Video.find({}).select('name videoUrl aboutPoints rating age address ratings votedBy');
    res.status(200).send(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: 'Error fetching videos' });
  }
});

// Dynamic Battle Summary API
app.get('/api/battles/summary', async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    // Ongoing: Today's videos (uploaded since midnight)
    const ongoingVideos = await Video.find({
      createdAt: { $gte: startOfToday }
    }).select('name videoUrl aboutPoints rating age address ratings votedBy createdAt uploadedBy');

    // Previous: Yesterday's videos (uploaded between yesterday and today's midnight)
    // If today just started and no videos yet, we might want to look at "current" versus "previous" differently.
    // But as per user: "at 12 am of next day we announce the winner then next contest starts"
    const yesterdayVideos = await Video.find({
      createdAt: { $gte: startOfYesterday, $lt: startOfToday }
    }).select('name videoUrl aboutPoints rating age address ratings votedBy createdAt uploadedBy');

    const MIN_VOTES = 5; // Production minimum requirement

    const getWinners = (videosList) => {
      if (videosList.length === 0) return [];

      const withAvg = videosList.map(v => {
        const obj = v.toObject ? v.toObject() : v;
        const avg = obj.ratings && obj.ratings.length > 0 ? obj.ratings.reduce((s, r) => s + r, 0) / obj.ratings.length : 0;
        return {
          ...obj,
          avgRating: avg,
          diff: Math.abs(avg - obj.rating)
        };
      }).filter(v => (v.ratings ? v.ratings.length : 0) >= MIN_VOTES);

      if (withAvg.length === 0) return [];

      // Filter to eligible candidates (diff <= 0.5)
      const matched = withAvg.filter(v => v.diff <= 0.5);
      
      // If no one is within 0.5 diff, find the best overall or return empty?
      // "Among eligible contestants... Smallest difference wins"
      const candidates = matched.length > 0 ? matched : withAvg;

      // Sort by the new logic
      candidates.sort((a, b) => {
        if (a.diff !== b.diff) return a.diff - b.diff; // Smallest diff wins
        if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating; // Higher audience rating wins
        const aVotes = a.ratings ? a.ratings.length : 0;
        const bVotes = b.ratings ? b.ratings.length : 0;
        if (aVotes !== bVotes) return bVotes - aVotes; // More votes wins
        return new Date(a.createdAt) - new Date(b.createdAt); // Earlier upload wins
      });

      // Handle co-winners securely (exact tie across top parameters)
      const winners = [candidates[0]];
      const top = candidates[0];
      const topVotes = top.ratings ? top.ratings.length : 0;

      for (let i = 1; i < candidates.length; i++) {
        const c = candidates[i];
        const cVotes = c.ratings ? c.ratings.length : 0;
        if (c.diff === top.diff && c.avgRating === top.avgRating && cVotes === topVotes) {
          winners.push(c);
        } else {
          break;
        }
      }
      return winners;
    };

    let winners = getWinners(yesterdayVideos);

    res.status(200).json({
      success: true,
      ongoing: ongoingVideos,
      winners: winners,
      winner: winners[0] || null,
      timestamp: now,
      serverTime: now.toISOString()
    });
  } catch (error) {
    console.error("Error in battle summary:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Preview API: Calculate projected winner using TODAY'S active submissions
app.get('/api/battles/test-winner', async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);

    const ongoingVideos = await Video.find({
      createdAt: { $gte: startOfToday }
    });

    if (ongoingVideos.length === 0) return res.json({ winners: [], message: "No submissions yet today." });

    const MIN_VOTES = 5;
    
    const withAvg = ongoingVideos.map(v => {
      const obj = v.toObject();
      const avg = obj.ratings && obj.ratings.length > 0 ? obj.ratings.reduce((s, r) => s + r, 0) / obj.ratings.length : 0;
      return { ...obj, avgRating: avg, diff: Math.abs(avg - obj.rating) };
    }).filter(v => (v.ratings ? v.ratings.length : 0) >= MIN_VOTES);

    if (withAvg.length === 0) return res.json({ winners: [], message: "No videos meet minimum vote threshold (5) yet." });

    const matched = withAvg.filter(v => v.diff <= 0.5);
    const candidates = matched.length > 0 ? matched : withAvg;

    candidates.sort((a, b) => {
      if (a.diff !== b.diff) return a.diff - b.diff;
      if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
      const aVotes = a.ratings ? a.ratings.length : 0;
      const bVotes = b.ratings ? b.ratings.length : 0;
      if (aVotes !== bVotes) return bVotes - aVotes;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    const winners = [candidates[0]];
    const top = candidates[0];
    const topVotes = top.ratings ? top.ratings.length : 0;
    for (let i = 1; i < candidates.length; i++) {
        const c = candidates[i];
        const cv = c.ratings ? c.ratings.length : 0;
        if (c.diff === top.diff && c.avgRating === top.avgRating && cv === topVotes) { winners.push(c); } else { break; }
    }

    res.json({ winners, winner: winners[0] || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/rate', async (req, res) => {
  // Midnight Lock: No voting between 11:59:00 PM and 11:59:59 PM
  const nowTime = new Date();
  if (nowTime.getHours() === 23 && nowTime.getMinutes() === 59) {
    return res.status(400).json({ error: 'Voting is currently locked for daily calculation.' });
  }

  const { videoid, rating, userId } = req.body;
  try {
    const video = await Video.findById(videoid);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    if (!userId) {
      return res.status(400).json({ error: 'Must provide userId to vote' });
    }
    
    if (video.votedBy && video.votedBy.includes(userId)) {
      return res.status(400).json({ error: 'Duplicate vote: You have already rated this video.' });
    }
    
    // Add rating to the ratings array (not aboutPoints)
    video.ratings.push(parseInt(rating));
    if (!video.votedBy) video.votedBy = [];
    video.votedBy.push(userId);
    await video.save();
    res.status(200).json({ message: 'Rating added', success: true });
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({ error: 'Error adding rating' });
  }
})

app.post('/getVid', async (req, res) => {
  const { username } = req.body;
  console.log(username);
  const user = await User.findOne({ firstName: username });
  console.log(user);
  if (!user) return res.status(400).send("Error occurred");
  if (user.videos.length > 0) return res.send(user.videos[user.videos.length - 1]);
  return res.status(400).send("Error occurred");
})

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', contactRoutes);

// Admin: Delete a video by ID
app.delete('/api/admin/video/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.status(200).json({ success: true, message: 'Video deleted successfully' });
  } catch (err) {
    console.error('Error deleting video:', err);
    res.status(500).json({ message: 'Error deleting video' });
  }
});

app.post('/api/updateProfile', async (req, res) => {
  try {
    const { userId, firstName, lastName, email, bio } = req.body;

    // Validate input
    if (!userId || !firstName || !email) {
      return res.status(400).json({ message: 'First name and email are required.' });
    }

    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update user data (excluding avatar)
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.bio = bio || user.bio; // Bio is optional in this case

    // Save the updated user data in the database
    await user.save();

    // Respond with the updated profile (without avatar change)
    res.status(200).json({
      message: 'Profile updated successfully!',
      userProfile: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// // Razorpay configuration
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID, // Use environment variables for security
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // Route to create a Razorpay order
// app.post('/create-order', async (req, res) => {
//   const { amount } = req.body; // Amount in INR (should be in paise)

//   // Razorpay options
//   const options = {
//     amount: amount * 100, // Convert amount to paise (1 INR = 100 paise)
//     currency: 'INR',
//     receipt: `receipt#${Math.floor(Math.random() * 10000)}`,
//   };

//   try {
//     // Create Razorpay order
//     const order = await razorpay.orders.create(options);
//     res.json(order);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to create Razorpay order' });
//   }
// });

// Home route
app.get('/', (req, res) => {
  res.send('<h1>Home Page</h1>');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Create HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const io = socketIo(server);

// Listen for client connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for the 'sendNotification' event from the client
  socket.on('sendNotification', (data) => {
    console.log('Notification received:', data);
    // Emit the notification to all connected clients
    io.emit('receiveNotification', { message: 'New Notification from Server!' });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Contact route
app.get('/contact', (req, res) => {
  res.json({
    message: 'Welcome to the Contact Page!',
    email: 'support@example.com',
    phone: '+1-234-567-890',
    address: '123 Main Street, City, Country',
  });
});

// Razorpay configuration
const razorpay = new Razorpay({
  key_id: 'rzp_test_jX0Zhni0nTh4Wp',
  key_secret: 'mGCPGnETTmsFmhXO9U48euDO',
});

// Routes
//app.use('/api/auth', authRoutes);  // Register the auth routes

// Route to create a Razorpay order
app.post('/create-order', async (req, res) => {
  const options = {
    amount: 1 * 100, // ₹1 = 100 paisa
    currency: 'INR',
    receipt: `receipt#${Math.floor(Math.random() * 10000)}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
