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

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://latent-u5prcrsl0-abhishek1161be22-chitkaraedus-projects.vercel.app'
  ],
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

const upload = multer({ storage: storage, limits: { fileSize: 10000000 } });

app.post('/fileupload', upload.single('uploadfile'), async (req, res) => {
  console.log("file:", req.file.path);
  console.log(req.body);
  const user = await User.findOne({ firstName: req.body.name });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  user.videos.push(req.file.path);
  await user.save();
  const video = new Video({
    name: req.body.name,
    videoUrl: req.file.path,
    address: req.body.address,
    age: parseInt(req.body.age),
    rating: parseInt(req.body.rating)
  })
  await video.save();
  res.status(200).json(req.file.path);
});

app.post('/allVideos', (async (req, res) => {
  const videos = await Video.find({});
  res.status(200).send(videos);
}))

app.post('/rate', async (req, res) => {
  const { videoid, rating } = req.body;
  const video = await Video.findById(videoid);
  video.aboutPoints.push(rating);
  await video.save();
  res.status(200).json({ message: 'Rating added' });
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
