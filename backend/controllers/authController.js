const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Add this import statement
const User = require('../models/User');

// Signup function
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const randomNumber = Math.floor(Math.random() * 100) + 1;

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      avatar: "", // No default avatar, we'll use initials in frontend
      role: role || 'user'
    });

    // Save to database
    await newUser.save();

    // Generate token immediately so user is logged in after signup
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        avatar: newUser.avatar,
        bio: newUser.bio,
        role: newUser.role,
      }
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET, // Use an environment variable for the secret key
      { expiresIn: '1h' } // Token expiration time
    );

    // Send response with avatar included
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: existingUser._id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        avatar: existingUser.avatar,
        bio: existingUser.bio,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Find the user from the decoded token
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error during check-auth:', error);
    res.status(500).json({ message: 'Server error' });
  }
};