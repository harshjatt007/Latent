import React, { useState, useEffect } from 'react';
import { Trophy, VideoIcon, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [topPerformer, setTopPerformer] = useState(null);

  // Mock data structure - replace with your actual data fetching logic
  const mockVideos = [
    {
      id: '1',
      participantName: 'Emily Rodriguez',
      videoTitle: 'Contemporary Dance',
      selfRating: 4.5,
      averageViewerRating: 4.7,
      videoUrl: 'https://example.com/video1',
      votesReceived: 95
    },
    {
      id: '2',
      participantName: 'Michael Chen',
      videoTitle: 'Acoustic Guitar Performance',
      selfRating: 4.2,
      averageViewerRating: 4.3,
      videoUrl: 'https://example.com/video2',
      votesReceived: 88
    },
    {
      id: '3',
      participantName: 'Sarah Thompson',
      videoTitle: 'Original Spoken Word',
      selfRating: 4.0,
      averageViewerRating: 4.1,
      videoUrl: 'https://example.com/video3',
      votesReceived: 76
    }
  ];

  useEffect(() => {
    // In a real app, fetch videos from your backend
    setVideos(mockVideos);

    // Find top performer based on highest votes
    const findTopPerformer = () => {
      return mockVideos.reduce((top, current) => 
        (current.votesReceived > top.votesReceived) ? current : top
      );
    };

    setTopPerformer(findTopPerformer());
  }, []);

  return (
    <div className="dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 bg-[#3D3BF3] min-h-screen">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-white">Talent Showcase Admin Dashboard</h1>
        </motion.div>
      </header>

      {/* Winner Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#EBEAFF] shadow-md rounded-lg p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Current Top Performer
          </h2>
          <Trophy className="text-yellow-500" size={32} />
        </div>
        {topPerformer ? (
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{topPerformer.participantName}</h3>
              <p className="text-gray-600">{topPerformer.videoTitle}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Star className="text-yellow-400" />
                <span className="text-gray-700">
                  Votes: {topPerformer.votesReceived} 
                  | Rating: {topPerformer.averageViewerRating}/5
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No participants found</p>
        )}
      </motion.section>

      {/* Video Submissions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#EBEAFF] shadow-md rounded-lg p-6"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Video Submissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Participant</th>
                <th className="py-3 px-6 text-left">Video Title</th>
                <th className="py-3 px-6 text-center">Self Rating</th>
                <th className="py-3 px-6 text-center">Viewer Rating</th>
                <th className="py-3 px-6 text-center">Votes</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {videos.map((video) => (
                <tr key={video.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <span className="font-medium">{video.participantName}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{video.videoTitle}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className="bg-yellow-200 text-yellow-600 py-1 px-3 rounded-full text-xs">
                      {video.selfRating}/5
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">
                      {video.averageViewerRating}/5
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span>{video.votesReceived}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <a 
                      href={video.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
                    >
                      <VideoIcon className="mr-2" size={16} /> View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
};

export default Dashboard;