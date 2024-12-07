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

// Enable CORS
app.use(cors());

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

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/form', formRoutes);

// Razorpay configuration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Use environment variables for security
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Route to create a Razorpay order
app.post('/create-order', async (req, res) => {
  const { amount } = req.body; // Amount in INR (should be in paise)

  // Razorpay options
  const options = {
    amount: amount * 100, // Convert amount to paise (1 INR = 100 paise)
    currency: 'INR',
    receipt: `receipt#${Math.floor(Math.random() * 10000)}`,
  };

  try {
    // Create Razorpay order
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

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

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
