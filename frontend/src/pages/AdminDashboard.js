import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  Video, 
  Trash2, 
  Check, 
  X, 
  DollarSign, 
  Trophy, 
  Star,
  ArrowLeft 
} from 'lucide-react';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [videos, setVideos] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    totalRevenue: 0,
    pendingApprovals: 0
  });

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated || user?.email !== 'abhishek1161.be22@chitkara.edu.in') {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, navigate]);

  const fetchData = async () => {
    try {
      // Fetch videos
      const videosResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/allVideos`);
      setVideos(videosResponse.data);

      // Fetch rankings
      const rankingsResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/getRankings`);
      setRankings(rankingsResponse.data);

      // Fetch pending role requests
      const token = localStorage.getItem('token');
      const pendingResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/auth/pending-role-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingRequests(pendingResponse.data.requests);

      // Update stats
      setStats({
        totalUsers: 50, // Mock data - you can implement actual user count
        totalVideos: videosResponse.data.length,
        totalRevenue: 2500, // Mock data - implement actual revenue tracking
        pendingApprovals: pendingResponse.data.requests.length
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/admin/video/${videoId}`, {
          data: { adminId: user.id }
        });
        
        alert('Video deleted successfully');
        fetchData(); // Refresh the data
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Error deleting video');
      }
    }
  };

  const handleRoleApproval = async (userId, approve) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/auth/approve-role-request`, {
        userId,
        approve
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(`Role request ${approve ? 'approved' : 'rejected'} successfully`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error processing role request:', error);
      alert('Error processing role request');
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-blue-500 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100">Total Users</p>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <Users size={40} />
        </div>
      </div>
      
      <div className="bg-green-500 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100">Total Videos</p>
            <p className="text-3xl font-bold">{stats.totalVideos}</p>
          </div>
          <Video size={40} />
        </div>
      </div>
      
      <div className="bg-yellow-500 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-100">Revenue</p>
            <p className="text-3xl font-bold">${stats.totalRevenue}</p>
          </div>
          <DollarSign size={40} />
        </div>
      </div>
      
      <div className="bg-red-500 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100">Pending Approvals</p>
            <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
          </div>
          <Users size={40} />
        </div>
      </div>
    </div>
  );

  const renderVideoManagement = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Video Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Self Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Ratings</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {videos.map((video) => {
              const avgRating = video.ratings && video.ratings.length > 0 
                ? (video.ratings.reduce((a, b) => a + b, 0) / video.ratings.length).toFixed(1)
                : '0.0';
              
              return (
                <tr key={video._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{video.name}</div>
                    <div className="text-sm text-gray-500">{video.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{video.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {video.rating}/5
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {avgRating}/5
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {video.ratings ? video.ratings.length : 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => window.open(video.videoUrl, '_blank')}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(video._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRoleApprovals = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Role Approval Requests</h3>
      </div>
      {pendingRequests.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          No pending role requests
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {pendingRequests.map((request) => (
            <div key={request._id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {request.firstName} {request.lastName}
                </div>
                <div className="text-sm text-gray-500">{request.email}</div>
                <div className="text-sm text-blue-600">
                  Requested Role: {request.requestedRole}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRoleApproval(request._id, true)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <Check size={16} className="mr-1" />
                  Approve
                </button>
                <button
                  onClick={() => handleRoleApproval(request._id, false)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <X size={16} className="mr-1" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRankings = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Current Rankings</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {rankings.slice(0, 10).map((video, index) => (
          <div key={video._id} className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{video.name}</div>
                <div className="text-sm text-gray-500">Age: {video.age}</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {video.totalRatings} ratings
              </div>
              <div className="flex items-center">
                <Star className="text-yellow-400 mr-1" size={16} />
                <span className="text-sm font-medium">{video.averageRating}/5</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.firstName}</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Home
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'videos', name: 'Video Management' },
                { id: 'approvals', name: 'Role Approvals' },
                { id: 'rankings', name: 'Rankings' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'videos' && renderVideoManagement()}
            {activeTab === 'approvals' && renderRoleApprovals()}
            {activeTab === 'rankings' && renderRankings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;