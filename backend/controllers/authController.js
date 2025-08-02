const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Add this import statement
const User = require('../models/User');

// Original admin email
const ORIGINAL_ADMIN_EMAIL = 'abhishek1161.be22@chitkara.edu.in';

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

    let userRole = 'participant';
    let isApproved = true; // Auto-approve all users by default
    let approvalRequestPending = false;

    // Check if this is the original admin
    if (email === ORIGINAL_ADMIN_EMAIL) {
      userRole = 'admin';
      isApproved = true;
    } else {
      // For regular users, set their role based on request
      if (role === 'admin') {
        // Admin role requests require approval
        approvalRequestPending = true;
        isApproved = false;
        userRole = 'participant'; // Keep as participant until approved
      } else {
        // Participants and audience are auto-approved
        userRole = role || 'participant';
        isApproved = true;
      }
    }

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      avatar: `https://avatar.iran.liara.run/public/${randomNumber}`,
      role: userRole,
      isApproved,
      approvalRequestPending,
      requestedRole: role || 'participant'
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
    if (approvalRequestPending) {
      message = 'Registration successful. Your admin role request is pending approval.';
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
        avatar: newUser.avatar,
        bio: newUser.bio,
        isApproved: newUser.isApproved,
        approvalRequestPending: newUser.approvalRequestPending,
        requestedRole: newUser.requestedRole
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

    // Check if user is approved - only block if admin request is pending
    if (!existingUser.isApproved && existingUser.approvalRequestPending) {
      return res.status(403).json({ 
        message: 'Your admin role request is pending approval. You can login once approved.',
        approvalRequestPending: existingUser.approvalRequestPending
      });
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
        avatar: existingUser.avatar,
        bio: existingUser.bio,
        isApproved: existingUser.isApproved,
        approvalRequestPending: existingUser.approvalRequestPending,
        requestedRole: existingUser.requestedRole
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
        avatar: user.avatar,
        bio: user.bio,
        isApproved: user.isApproved,
        approvalRequestPending: user.approvalRequestPending,
        requestedRole: user.requestedRole
      }
    });
  } catch (error) {
    console.error('Error during check-auth:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// New function to get pending approval requests (admin only)
exports.getPendingRequests = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.id);
    
    // Check if the requesting user is an admin
    if (requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Get all users with pending approval requests
    const pendingUsers = await User.find({ 
      approvalRequestPending: true 
    }).select('firstName lastName email requestedRole createdAt');

    res.status(200).json({ pendingRequests: pendingUsers });
  } catch (error) {
    console.error('Error getting pending requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// New function to approve/reject user requests (admin only)
exports.approveUser = async (req, res) => {
  try {
    const { userId, approve } = req.body;
    const requestingUser = await User.findById(req.user.id);
    
    // Check if the requesting user is an admin
    if (requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (approve) {
      // Approve the user and set their role to the requested role
      userToUpdate.isApproved = true;
      userToUpdate.approvalRequestPending = false;
      userToUpdate.role = userToUpdate.requestedRole;
    } else {
      // Reject the request - keep as participant
      userToUpdate.approvalRequestPending = false;
      userToUpdate.requestedRole = 'participant';
    }

    await userToUpdate.save();

    res.status(200).json({ 
      message: approve ? 'User approved successfully' : 'User request rejected',
      user: {
        id: userToUpdate._id,
        firstName: userToUpdate.firstName,
        lastName: userToUpdate.lastName,
        email: userToUpdate.email,
        role: userToUpdate.role,
        isApproved: userToUpdate.isApproved
      }
    });
  } catch (error) {
    console.error('Error approving user:', error);
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
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        isApproved: updatedUser.isApproved,
        approvalRequestPending: updatedUser.approvalRequestPending,
        requestedRole: updatedUser.requestedRole
      }
    });
  } catch (error) {
    console.error('Error during profile update:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// New function to promote user to admin (admin only)
exports.promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    const requestingUser = await User.findById(req.user.id);
    
    // Check if the requesting user is an admin
    if (requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const userToPromote = await User.findById(userId);
    if (!userToPromote) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Promote user to admin
    userToPromote.role = 'admin';
    userToPromote.isApproved = true;
    userToPromote.approvalRequestPending = false;
    userToPromote.requestedRole = 'admin';

    await userToPromote.save();

    res.status(200).json({ 
      message: 'User promoted to admin successfully',
      user: {
        id: userToPromote._id,
        firstName: userToPromote.firstName,
        lastName: userToPromote.lastName,
        email: userToPromote.email,
        role: userToPromote.role,
        isApproved: userToPromote.isApproved
      }
    });
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// New function to get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.id);
    
    // Check if the requesting user is an admin
    if (requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Get all users except passwords
    const users = await User.find({}).select('-password');

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};