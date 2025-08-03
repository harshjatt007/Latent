# Latent - Talent Showcase Platform

A platform where users can upload their talent videos, rate other contestants, and compete in a talent showcase.

## 🚀 Features

- **Video Upload**: Upload talent videos with detailed information
- **Rating System**: Rate other contestants' performances
- **Dashboard**: View all uploaded videos and competition statistics
- **User Authentication**: Secure login and registration system
- **Real-time Updates**: Live updates for ratings and submissions

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for video storage)

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SESSION_SECRET=your_session_secret
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🔧 Recent Fixes

### Issues Fixed:

1. **Form Submission**: 
   - Fixed video upload not appearing in ratings and dashboard
   - Improved error handling and user feedback
   - Added proper form validation

2. **Backend API**:
   - Fixed user authentication requirement for video uploads
   - Improved error handling in `/fileupload` endpoint
   - Added better response formatting

3. **Dashboard**:
   - Updated to display all uploaded videos
   - Added competition statistics
   - Improved video grid layout

4. **Ratings Page**:
   - Enhanced video display with better styling
   - Added loading states and error handling
   - Improved rating functionality

5. **Environment Configuration**:
   - Added API configuration for both local and production
   - Updated CORS settings for local development
   - Created centralized API endpoint management

## 🌐 Deployment

### Backend Deployment (Render)

1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy the backend directory
4. Update the API base URL in frontend config

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Deploy

## 📁 Project Structure

```
├── backend/
│   ├── server.js          # Main server file
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── controllers/       # Business logic
│   └── config/           # Configuration files
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── config/       # API configuration
│   │   └── store/        # State management
│   └── public/           # Static files
└── README.md
```

## 🔄 API Endpoints

- `POST /fileupload` - Upload video with form data
- `POST /allVideos` - Get all uploaded videos
- `POST /rate` - Rate a video
- `POST /getVid` - Get user's video

## 🎯 Usage

1. **Upload Video**: Fill out the form with your details and upload a video
2. **View Dashboard**: See all uploaded videos and competition stats
3. **Rate Videos**: Visit the ratings page to rate other contestants
4. **Track Progress**: Monitor your ranking and performance

## 🐛 Troubleshooting

### Common Issues:

1. **Videos not appearing**: Check if the backend is running and MongoDB is connected
2. **Upload errors**: Verify Cloudinary credentials and file size limits
3. **CORS errors**: Ensure the frontend URL is added to allowed origins
4. **Rating not updating**: Check if the video ID is correct and backend is responding

### Local Development:

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- Make sure both servers are running simultaneously

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support, please open an issue in the GitHub repository or contact the development team.

## Preview Deployment

// Sync preview with development
