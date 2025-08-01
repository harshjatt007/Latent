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

    // Check if user is trying to register as admin
    let userRole = role || 'participant';
    let roleStatus = 'approved';
    let requestedRole = null;

    // Only the specific admin email can be admin directly
    if (role === 'admin' && email !== 'abhishek1161.be22@chitkara.edu.in') {
      userRole = 'participant'; // Set as participant temporarily
      roleStatus = 'pending'; // Needs approval
      requestedRole = 'admin'; // Store the requested role
    }

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      avatar: `https://avatar.iran.liara.run/public/${randomNumber}`,
      role: userRole,
      roleStatus,
      requestedRole
    });

    // Save to database
    await newUser.save();

    // Generate token for the new user
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    let message = 'User registered successfully';
    if (requestedRole === 'admin') {
      message = 'Registration successful! Your admin role request is pending approval from the main administrator.';
    }

    res.status(201).json({ 
      message,
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        roleStatus: newUser.roleStatus,
        requestedRole: newUser.requestedRole,
        avatar: newUser.avatar,
        bio: newUser.bio,
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

    // Send response
    res.status(200).json({
      message: 'Login successful',
      token, // Include token
      user: {
        id: existingUser._id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        role: existingUser.role,
        roleStatus: existingUser.roleStatus,
        requestedRole: existingUser.requestedRole,
        avatar: existingUser.avatar,
        bio: existingUser.bio,
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

    res.status(200).json({ 
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        roleStatus: user.roleStatus,
        requestedRole: user.requestedRole,
        avatar: user.avatar,
        bio: user.bio,
      }
    });
  } catch (error) {
    console.error('Error during check-auth:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, avatar } = req.body;
    const userId = req.user.id;

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        bio,
        avatar
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        roleStatus: updatedUser.roleStatus,
        requestedRole: updatedUser.requestedRole,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
      }
    });
  } catch (error) {
    console.error('Error during profile update:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin functions
exports.getPendingRoleRequests = async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.email !== 'abhishek1161.be22@chitkara.edu.in') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const pendingRequests = await User.find({ 
      roleStatus: 'pending' 
    }).select('firstName lastName email requestedRole createdAt');

    res.status(200).json({ requests: pendingRequests });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveRoleRequest = async (req, res) => {
  try {
    const { userId, approve } = req.body;
    
    // Check if user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.email !== 'abhishek1161.be22@chitkara.edu.in') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (approve) {
      user.role = user.requestedRole;
      user.roleStatus = 'approved';
      user.requestedRole = null;
    } else {
      user.roleStatus = 'rejected';
      user.requestedRole = null;
    }

    await user.save();

    res.status(200).json({ 
      message: `Role request ${approve ? 'approved' : 'rejected'} successfully`,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        roleStatus: user.roleStatus,
      }
    });
  } catch (error) {
    console.error('Error processing role request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};