const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');
require('dotenv').config();

const ORIGINAL_ADMIN_EMAIL = 'abhishek1161.be22@chitkara.edu.in';

const setupAdmin = async () => {
  try {
    // Connect to MongoDB using the same connection logic as the main app
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ORIGINAL_ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      
      // Update existing user to ensure they have admin privileges
      existingAdmin.role = 'admin';
      existingAdmin.isApproved = true;
      existingAdmin.approvalRequestPending = false;
      existingAdmin.requestedRole = 'admin';
      
      await existingAdmin.save();
      console.log('Updated existing admin user privileges');
    } else {
      // Create new admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt); // Default password
      
      const adminUser = new User({
        firstName: 'Abhishek',
        lastName: 'Admin',
        email: ORIGINAL_ADMIN_EMAIL,
        password: hashedPassword,
        avatar: 'https://avatar.iran.liara.run/public/1',
        role: 'admin',
        isApproved: true,
        approvalRequestPending: false,
        requestedRole: 'admin',
        bio: 'Original Administrator'
      });

      await adminUser.save();
      console.log('Created new admin user');
      console.log('Email:', ORIGINAL_ADMIN_EMAIL);
      console.log('Default Password: admin123');
      console.log('Please change the password after first login');
    }

    console.log('Admin setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin:', error);
    console.log('Note: Make sure your MongoDB connection is configured properly in environment variables.');
    process.exit(1);
  }
};

// Run the setup
setupAdmin();