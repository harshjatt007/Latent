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
const fs = require('fs');
const path = require('path');

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://latent-u5prcrsl0-abhishek1161be22-chitkaraedus-projects.vercel.app',
  'https://latent-delta.vercel.app',
  'https://latent-kk5m.onrender.com',
  /^https:\/\/.*\.vercel\.app$/,
  /^https:\/\/latent.*\.vercel\.app$/
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') return origin === allowedOrigin || origin.startsWith(allowedOrigin);
      if (allowedOrigin instanceof RegExp) return allowedOrigin.test(origin);
      return false;
    });
    if (allowed) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.options('*', cors(corsOptions));

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

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
  params: { folder: 'uploads', resource_type: 'auto' }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50000000 },
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) cb(null, true);
    else cb(new Error('Only images and videos are allowed!'), false);
  }
});

app.post('/fileupload', upload.single('uploadfile'), async (req, res) => {
  const nowTime = new Date();
  if (nowTime.getHours() >= 22) return res.status(400).json({ success: false, error: 'Uploads are closed (12 AM - 10 PM).' });

  const userId = req.body.userId || req.body.id;
  if (userId) {
     const startOfToday = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate());
     const existingVideo = await Video.findOne({ uploadedBy: String(userId), createdAt: { $gte: startOfToday } });
     if (existingVideo) return res.status(400).json({ success: false, error: 'Limit reached (1 per day).' });
  }
  
  let aboutPoints = [];
  try { aboutPoints = JSON.parse(req.body.aboutPoints || "[]"); } catch (error) { aboutPoints = []; }

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
      ratings: [] 
    });
    await video.save();
    res.status(200).json({ success: true, message: 'Uploaded', videoPath: videoUrlPath, videoId: video._id });
  } catch (error) { res.status(500).json({ success: false, error: 'Error' }); }
});

app.get('/api/check-participation/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const today = new Date();
    today.setHours(0,0,0,0);
    const existingVideo = await Video.findOne({ uploadedBy: String(userId), createdAt: { $gte: today } });
    res.status(200).json({ participated: !!existingVideo, videoId: existingVideo?._id });
  } catch (error) { res.status(500).json({ error: "Server error" }); }
});

app.post('/allVideos', async (req, res) => {
  try {
    const videos = await Video.find({}).select('name videoUrl aboutPoints rating age address ratings votedBy');
    res.status(200).send(videos);
  } catch (error) { res.status(500).json({ error: 'Error' }); }
});

app.get('/api/battles/summary', async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const ongoingVideos = await Video.find({ createdAt: { $gte: startOfToday } }).select('name videoUrl aboutPoints rating age address ratings votedBy createdAt uploadedBy');
    const yesterdayVideos = await Video.find({ createdAt: { $gte: startOfYesterday, $lt: startOfToday } }).select('name videoUrl aboutPoints rating age address ratings votedBy createdAt uploadedBy');

    const MIN_VOTES = 5;
    const getWinners = (list) => {
      if (list.length === 0) return [];
      const withAvg = list.map(v => {
        const obj = v.toObject ? v.toObject() : v;
        const avg = obj.ratings && obj.ratings.length > 0 ? obj.ratings.reduce((s, r) => s + r, 0) / obj.ratings.length : 0;
        return { ...obj, avgRating: avg, diff: Math.abs(avg - obj.rating) };
      }).filter(v => (v.ratings ? v.ratings.length : 0) >= MIN_VOTES);

      if (withAvg.length === 0) return [];
      const matched = withAvg.filter(v => v.diff <= 0.5);
      const candidates = matched.length > 0 ? matched : withAvg;
      candidates.sort((a, b) => {
        if (a.diff !== b.diff) return a.diff - b.diff;
        if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
        const av = a.ratings ? a.ratings.length : 0;
        const bv = b.ratings ? b.ratings.length : 0;
        if (av !== bv) return bv - av;
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      const winners = [candidates[0]];
      const top = candidates[0];
      const topVotes = top.ratings ? top.ratings.length : 0;
      for (let i = 1; i < candidates.length; i++) {
        const c = candidates[i];
        const cv = c.ratings ? c.ratings.length : 0;
        if (c.diff === top.diff && c.avgRating === top.avgRating && cv === topVotes) winners.push(c); else break;
      }
      return winners;
    };
    let winners = getWinners(yesterdayVideos);
    res.status(200).json({ success: true, ongoing: ongoingVideos, winners, winner: winners[0] || null, timestamp: now });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get('/api/battles/test-winner', async (req, res) => {
  try {
    const startOfToday = new Date().setHours(0,0,0,0);
    const ongoingVideos = await Video.find({ createdAt: { $gte: startOfToday } });
    if (ongoingVideos.length === 0) return res.json({ winners: [] });
    const MIN_VOTES = 5;
    const withAvg = ongoingVideos.map(v => {
      const obj = v.toObject();
      const avg = obj.ratings && obj.ratings.length > 0 ? obj.ratings.reduce((s, r) => s + r, 0) / obj.ratings.length : 0;
      return { ...obj, avgRating: avg, diff: Math.abs(avg - obj.rating) };
    }).filter(v => (v.ratings ? v.ratings.length : 0) >= MIN_VOTES);
    if (withAvg.length === 0) return res.json({ winners: [] });
    const matched = withAvg.filter(v => v.diff <= 0.5);
    const candidates = matched.length > 0 ? matched : withAvg;
    candidates.sort((a, b) => (a.diff !== b.diff ? a.diff - b.diff : b.avgRating - a.avgRating));
    res.json({ winners: [candidates[0]], winner: candidates[0] });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/rate', async (req, res) => {
  const nowTime = new Date();
  if (nowTime.getHours() === 23 && nowTime.getMinutes() === 59) return res.status(400).json({ error: 'Voting is currently locked.' });
  const { videoid, rating, userId } = req.body;
  try {
    const video = await Video.findById(videoid);
    if (!video || !userId) return res.status(400).json({ error: 'Invalid' });
    if (video.votedBy?.includes(userId)) return res.status(400).json({ error: 'Already rated.' });
    video.ratings.push(parseInt(rating));
    if (!video.votedBy) video.votedBy = [];
    video.votedBy.push(userId);
    await video.save();
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Error' }); }
});

app.post('/getVid', async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ firstName: username });
  if (!user || user.videos?.length === 0) return res.status(400).send("No video");
  return res.send(user.videos[user.videos.length - 1]);
});

app.post('/api/updateProfile', async (req, res) => {
  const { userId, firstName, lastName, email, bio } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("Not found");
    user.firstName = firstName; user.lastName = lastName; user.email = email; user.bio = bio || user.bio;
    await user.save();
    res.status(200).send(user);
  } catch (err) { res.status(500).send("Error"); }
});

app.use(passport.initialize());
app.use(passport.session());
app.use('/api/auth', authRoutes);
app.use('/api', contactRoutes);

app.delete('/api/admin/video/:id', async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: 'Error' }); }
});

app.post('/create-order', async (req, res) => {
  try {
    const razorpay = new Razorpay({ key_id: 'rzp_test_jX0Zhni0nTh4Wp', key_secret: 'mGCPGnETTmsFmhXO9U48euDO' });
    const order = await razorpay.orders.create({ amount: 100, currency: 'INR', receipt: `rcpt_${Date.now()}` });
    res.json(order);
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

const server = http.createServer(app);
const io = socketIo(server);
io.on('connection', (socket) => {
  socket.on('sendNotification', (data) => io.emit('receiveNotification', { message: 'New Notification' }));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
