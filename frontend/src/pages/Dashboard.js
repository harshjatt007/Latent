import React, { useState, useEffect } from 'react';
import { Award, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  // const [userVideo, setUserVideo] = useState(null);
  // const [uploadProgress, setUploadProgress] = useState(0);
  const [videos, setVideos] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [competitionStats, setCompetitionStats] = useState({
    totalParticipants: 0,
    topRatedVideo: 0,
    myCurrentRanking: 0
  });

  const { user } = useAuthStore();

  const handleBackClick = () => {
    navigate('/');
  };

  async function getAllVideos(){
    try{
      const response = await axios.post(API_ENDPOINTS.allVideos);
      setVideos(response.data);
      
      // Get rankings
      const rankingsResponse = await axios.post(API_ENDPOINTS.getRankings);
      setRankings(rankingsResponse.data);
      
      // Find user's rank
      const userRank = rankingsResponse.data.find(video => video.name === user?.firstName);
      
      // Update competition stats
      setCompetitionStats({
        totalParticipants: response.data.length,
        topRatedVideo: rankingsResponse.data.length > 0 ? rankingsResponse.data[0].averageRating : 0,
        myCurrentRanking: userRank ? userRank.rank : 0
      });
    }catch(e){
      console.log("Error fetching videos:", e);
    }
  }

  useEffect(()=>{
    getAllVideos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // const handleVideoUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // Simulate upload progress
  //     const simulateUpload = () => {
  //       let progress = 0;
  //       const interval = setInterval(() => {
  //         progress += 20;
  //         setUploadProgress(progress);
          
  //         if (progress >= 100) {
  //           clearInterval(interval);
  //           setUserVideo({
  //             title: file.name,
  //             type: file.type,
  //             size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
  //           });
  //         }
  //       }, 500);
  //     };

  //     simulateUpload();
  //   }
  // };

  return (
<div className="dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 bg-[#3D3BF3] min-h-screen">
      {/* Header with Back Button */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-white">My Talent Showcase</h1>
        </motion.div>
        <button 
          onClick={handleBackClick}
          className="mt-4 sm:mt-0 sm:ml-4 flex items-center text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back
        </button>
      </header>

      {/* Competition Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#EBEAFF] shadow-md rounded-lg p-6 mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Competition Overview</h2>
          <Award className="text-yellow-500" size={32} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-600">Total Participants</p>
            <p className="text-2xl font-bold text-blue-600">
              {competitionStats.totalParticipants}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Top Rated</p>
            <p className="text-2xl font-bold text-green-600">
              {competitionStats.topRatedVideo}/5
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">My Ranking</p>
            <p className="text-2xl font-bold text-purple-600">
              #{competitionStats.myCurrentRanking}
            </p>
          </div>
        </div>
      </motion.section>

      {/* All Videos Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#EBEAFF] shadow-md rounded-lg p-6 mb-6"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">All Contestant Videos</h3>
        
        {videos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No videos uploaded yet. Be the first to upload!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <div key={video._id || index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <video 
                  src={video.videoUrl} 
                  controls 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-bold text-gray-800 mb-2">{video.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">Age: {video.age}</p>
                  <p className="text-sm text-gray-600 mb-2">Address: {video.address}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Self Rating:</span>
                    <span className="font-bold text-blue-600">{video.rating}/5 ⭐</span>
                  </div>
                  {video.aboutPoints && video.aboutPoints.length > 0 && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">Audience Rating:</span>
                      <span className="font-bold text-green-600">
                        {(video.aboutPoints && video.aboutPoints.length > 0) 
                          ? (video.aboutPoints.reduce((a, b) => a + b, 0) / video.aboutPoints.length).toFixed(1)
                          : '0.0'}/5 ⭐
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Rankings Section */}
      {rankings.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-[#EBEAFF] shadow-md rounded-lg p-6 mb-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">🏆 Current Rankings</h3>
          <div className="space-y-3">
            {rankings.slice(0, 10).map((video, index) => (
              <div key={video._id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{video.name}</h4>
                    <p className="text-sm text-gray-600">Average: {video.averageRating}/5 ⭐ ({video.totalRatings} ratings)</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Rank #{video.rank}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default UserDashboard;