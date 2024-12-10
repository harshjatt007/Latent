import React from 'react';
import { useParams } from 'react-router-dom';

const VideoPlayer = () => {
  const { filename } = useParams();
  const videoUrl = `/videos/${filename}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-4xl w-full p-4">
        <h2 className="text-2xl font-bold mb-4">Now Playing: {filename}</h2>
        <video
          src={videoUrl}
          controls
          className="w-full h-auto rounded-md shadow-lg"
        />
      </div>
    </div>
  );
};

export default VideoPlayer;