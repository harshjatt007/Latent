const express = require('express');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/formRoutes');
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
  'https://latent-kk5m.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS origin check:", origin);
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(allowedOrigin => origin.startsWith(allowedOrigin));
    if (allowed) {
      callback(null, true);
    } else {
      console.error("CORS origin rejected:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Enable CORS
app.use(cors(corsOptions));

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
    saveUninitialized: true,
  })
);


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

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(mp4|mkv|avi)$/)) {
      return cb(new Error('Only video files are allowed!'));
    }
    cb(null, true);
  }
});
app.post('/fileupload', upload.single('uploadfile'), async (req, res) => {
  console.log("file:", req.file.path);
  console.log(req.body);
  
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
    const video = new Video({
      name: req.body.name,
      videoUrl: req.file.path,
      address: req.body.address,
      age: parseInt(req.body.age),
      rating: parseInt(req.body.rating),
      aboutPoints: aboutPoints,
      ratings: [] // Initialize empty ratings array
    });
    await video.save();
    
    // Don't require user to exist - just create the video
    console.log("Video saved successfully:", video._id);
    
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

app.post('/allVideos', async (req, res) => {
  try {
    const videos = await Video.find({}).select('name videoUrl aboutPoints rating age address ratings');
    res.status(200).send(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: 'Error fetching videos' });
  }
});

app.post('/rate', async (req, res) => {
  const { videoid, rating, userId } = req.body;
  
  try {
    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to rate videos' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has audience role
    if (user.role !== 'audience' && user.role !== 'admin') {
      return res.status(403).json({ error: 'Only audience members can rate videos' });
    }

    const video = await Video.findById(videoid);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    // Add rating to the aboutPoints array (since that's where ratings are being saved)
    video.aboutPoints.push(parseInt(rating));
    await video.save();
    res.status(200).json({ message: 'Rating added' });
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

app.post('/getRankings', async (req, res) => {
  try {
    const videos = await Video.find({}).select('name videoUrl aboutPoints rating age address');
    
    // Calculate average ratings and create rankings
    const rankedVideos = videos.map(video => {
      const ratings = video.aboutPoints || [];
      const averageRating = ratings.length > 0 
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : 0;
      
      return {
        ...video.toObject(),
        averageRating: parseFloat(averageRating),
        totalRatings: ratings.length
      };
    });

    // Sort by average rating (highest first)
    rankedVideos.sort((a, b) => b.averageRating - a.averageRating);

    // Add rank position
    const finalRankings = rankedVideos.map((video, index) => ({
      ...video,
      rank: index + 1
    }));

    res.status(200).json(finalRankings);
  } catch (error) {
    console.error("Error getting rankings:", error);
    res.status(500).json({ error: 'Error getting rankings' });
  }
});

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);

app.post('/api/updateProfile', async (req, res) => {
  try {
    const { userId, firstName, lastName, email, bio } = req.body;

    // Validate input
    if (!userId || !firstName || !lastName || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required.' });
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
