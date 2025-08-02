# Latent - Deployment Guide

## Overview
Latent is a full-stack web application with React frontend and Node.js backend, designed for video competitions and user management.

## Architecture
- **Frontend**: React.js with Tailwind CSS, deployed on Vercel
- **Backend**: Node.js with Express, deployed as serverless functions
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary
- **Authentication**: JWT with Zustand state management

## Quick Deployment Steps

### 1. Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Cloudinary account
- Vercel account
- Git repository

### 2. Environment Setup

#### Backend Environment Variables
Create `.env` file in `/backend/` directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/latent-production

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_production

# Session Configuration
SESSION_SECRET=your_super_secure_session_secret_key_production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Razorpay Configuration (Optional)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### Frontend Environment Variables
Create `.env.production` file in `/frontend/` directory:

```env
REACT_APP_API_BASE_URL=https://your-backend-domain.vercel.app
```

### 3. Vercel Deployment

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy from Root Directory
```bash
# From project root
vercel --prod
```

The `vercel.json` configuration will handle both frontend and backend deployment.

#### Step 4: Set Environment Variables in Vercel Dashboard
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add all the backend environment variables listed above
4. Add the frontend environment variable

### 4. Database Setup

#### MongoDB Atlas
1. Create a MongoDB Atlas cluster
2. Create a database user
3. Whitelist Vercel's IP addresses (or use 0.0.0.0/0 for all IPs)
4. Get the connection string and update `MONGO_URI`

#### Initial Admin Setup
After deployment, run the admin setup:
```bash
cd backend
node setup-admin.js
```

### 5. Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Update the environment variables

## Development Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd latent
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup
Create `.env` files as described above (use development URLs)

### 4. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## Project Structure
```
latent/
├── backend/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   └── package.json
├── frontend/               # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   └── App.js         # Main app component
│   └── package.json
├── vercel.json            # Vercel deployment config
└── README.md
```

## Features
- ✅ Modern authentication with JWT
- ✅ Password strength indicator
- ✅ File upload with Cloudinary
- ✅ User role management (Admin, Judge, Participant)
- ✅ Video competition system
- ✅ Responsive design with Tailwind CSS
- ✅ Toast notifications for better UX
- ✅ Admin dashboard for user management

## Security Notes
- All secrets should be unique and secure in production
- MongoDB Atlas should have IP whitelisting configured
- CORS is properly configured for your domain
- File uploads are validated and limited

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` in backend environment matches your Vercel domain
   - Check allowed origins in `server.js`

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings
   - Ensure database user has proper permissions

3. **File Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits (current: 10MB)
   - Ensure supported file formats (mp4, mkv, avi)

4. **Authentication Issues**
   - Verify JWT_SECRET is set correctly
   - Check if user exists in database
   - Ensure cookies/tokens are being sent

### Performance Optimization
- Images and videos are optimized through Cloudinary
- Static assets are cached by Vercel CDN
- Database queries are optimized with indexes
- Frontend is built for production with code splitting

## Support
For issues and questions:
1. Check the troubleshooting section above
2. Review environment variable configuration
3. Check Vercel deployment logs
4. Verify database connectivity

## License
This project is proprietary. All rights reserved.