# Role-Based Access Control System Setup

This system implements a comprehensive role-based access control with three user types: **Admin**, **Audience**, and **Participants**.

## Features Implemented

### 1. User Roles & Access Control
- **Admin**: Can approve/reject user role requests, manage the platform
- **Audience**: Can view and rate videos (cannot upload or rate own videos)
- **Participants**: Can upload videos and fill forms (cannot rate videos)

### 2. Admin Approval System
- Only `abhishek1161.be22@chitkara.edu.in` is automatically approved as admin
- Users requesting Admin or Audience roles require admin approval
- Participants get instant access

### 3. Video Rating System
- Only audience members can rate videos
- Users cannot rate their own videos
- One vote per user per video
- Proper authentication required for voting

### 4. Role-Based Page Access
- Different dashboards for each role
- Protected routes based on user permissions
- Unauthorized access redirects

## Setup Instructions

### 1. Database Setup

First, ensure MongoDB is running and set up your environment variables:

```bash
# In backend directory, create .env file with:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Set Up Original Admin

Run this command to create the original admin user:

```bash
cd backend
npm run setup-admin
```

This creates an admin user with:
- **Email**: `abhishek1161.be22@chitkara.edu.in`
- **Password**: `admin123` (change after first login)

### 4. Start the Application

```bash
# Start backend (from backend directory)
npm start

# Start frontend (from frontend directory)
npm start
```

## User Registration & Approval Process

### For Participants (Instant Access)
1. Sign up with role "Participant"
2. Get immediate access to upload videos and fill forms
3. Cannot rate videos

### For Audience Members
1. Sign up with role "Audience"
2. Account pending admin approval
3. Admin approves/rejects from admin dashboard
4. Once approved, can rate videos but cannot upload

### For Additional Admins
1. Sign up with role "Admin"
2. Account pending approval from existing admin
3. Original admin approves/rejects the request
4. Once approved, can manage user approvals

## Admin Dashboard Features

The admin dashboard (`/admin-dashboard`) includes:
- View pending approval requests
- Approve/reject user role requests
- Statistics on approvals/rejections
- User management interface

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration with role selection
- `POST /api/auth/login` - User login
- `GET /api/auth/check-auth` - Verify authentication
- `GET /api/auth/pending-requests` - Get pending approvals (admin only)
- `POST /api/auth/approve-user` - Approve/reject users (admin only)

### Video Management
- `POST /fileupload` - Upload video (participants only)
- `POST /allVideos` - Get all videos
- `POST /rate` - Rate video (audience only)
- `POST /getRankings` - Get video rankings

## Role-Based Route Protection

### Public Routes
- `/` - Home page
- `/login` - Sign in
- `/signup` - Sign up
- `/contact` - Contact page

### Protected Routes
- `/dashboard` - Participant dashboard
- `/admin-dashboard` - Admin dashboard
- `/audience-dashboard` - Audience dashboard (redirects to battle page)
- `/form` - Video upload form (participants only)
- `/battle` - Video rating interface (audience only)
- `/ratings` - Video rating page (audience only)
- `/profile` - User profile (all authenticated users)

### Status Pages
- `/pending-approval` - Shown to users awaiting approval
- `/unauthorized` - Shown when accessing restricted content

## Security Features

1. **JWT-based authentication**
2. **Role verification on both frontend and backend**
3. **Video ownership tracking**
4. **One vote per user per video**
5. **Admin-only approval system**
6. **Protected file uploads with user verification**

## Database Schema Updates

### User Model
- Added `isApproved`, `approvalRequestPending`, `requestedRole`
- Added `ratedVideos` array to track user's ratings
- Added `uploadedVideos` array to track user's uploads

### Video Model
- Added `uploadedBy` field to track video owner
- Updated `ratings` array with userId and rating details
- Added `averageRating` and `totalRatings` calculated fields

## Testing the System

1. **Create Original Admin**: Run setup script
2. **Test Participant Flow**: Sign up as participant, upload video
3. **Test Audience Flow**: Sign up as audience, wait for approval, rate videos
4. **Test Admin Flow**: Sign up as admin, get approved by original admin
5. **Test Restrictions**: Try accessing unauthorized pages/actions

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**: Ensure MongoDB is running and MONGO_URI is set
2. **JWT Errors**: Set JWT_SECRET in environment variables
3. **File Upload Errors**: Configure Cloudinary credentials
4. **Role Access Issues**: Check user approval status in database

### Database Queries for Debugging

```javascript
// Check user roles and approval status
db.users.find({}, {firstName: 1, lastName: 1, email: 1, role: 1, isApproved: 1})

// Check pending approvals
db.users.find({approvalRequestPending: true})

// Check video ownership
db.videos.find({}, {name: 1, uploadedBy: 1}).populate('uploadedBy')
```

## Future Enhancements

1. Email notifications for approval status
2. Bulk user management for admins
3. Advanced video analytics
4. Role change requests from users
5. Audit logs for admin actions

---

**Important**: Change the default admin password immediately after first login for security purposes.