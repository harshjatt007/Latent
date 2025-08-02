import React, { useState, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { Users, CheckCircle, XCircle, Clock, Shield, UserCheck, AlertCircle, Crown } from 'lucide-react';
import { API_ENDPOINTS } from './config/api';

const AdminDashboard = () => {
  const { user, getPendingRequests, approveUser, pendingRequests, isLoading, error } = useAuthStore();
  const [activeTab, setActiveTab] = useState('pending');
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState({
    totalPending: 0,
    totalApproved: 0,
    totalRejected: 0
  });

  const loadPendingRequests = React.useCallback(async () => {
    try {
      await getPendingRequests();
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  }, [getPendingRequests]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadPendingRequests();
      loadAllUsers();
    }
  }, [user, loadPendingRequests]);

  useEffect(() => {
    setStats({
      totalPending: pendingRequests.length,
      totalApproved: stats.totalApproved,
      totalRejected: stats.totalRejected
    });
  }, [pendingRequests, stats.totalApproved, stats.totalRejected]);

  const loadAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.auth.allUsers, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data.users);
      } else {
        console.error('Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const promoteToAdmin = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.auth.promoteToAdmin, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        loadAllUsers(); // Refresh the user list
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to promote user');
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      alert('Error promoting user to admin');
    }
  };

  const handleApproval = async (userId, approve) => {
    try {
      await approveUser(userId, approve);
      if (approve) {
        setStats(prev => ({ 
          ...prev, 
          totalApproved: prev.totalApproved + 1,
          totalPending: prev.totalPending - 1 
        }));
      } else {
        setStats(prev => ({ 
          ...prev, 
          totalRejected: prev.totalRejected + 1,
          totalPending: prev.totalPending - 1 
        }));
      }
      // Refresh both lists
      loadPendingRequests();
      loadAllUsers();
    } catch (error) {
      console.error('Error handling approval:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'audience':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'participant':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.firstName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Shield className="w-4 h-4 mr-1" />
                Administrator
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approved Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApproved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rejected Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Pending Approvals ({pendingRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Crown className="w-4 h-4 inline mr-2" />
                User Management ({allUsers.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pending' && (
              <div>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
                    <p className="text-gray-500">All user requests have been processed.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-medium text-gray-900">
                                {request.firstName} {request.lastName}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(request.requestedRole)}`}>
                                {request.requestedRole}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-1">{request.email}</p>
                            <p className="text-sm text-gray-500">
                              Requested on {formatDate(request.createdAt)}
                            </p>
                          </div>
                          <div className="flex space-x-3 ml-4">
                            <button
                              onClick={() => handleApproval(request._id, true)}
                              disabled={isLoading}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleApproval(request._id, false)}
                              disabled={isLoading}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                {allUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
                    <p className="text-gray-500">No users available to manage.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">All Users</h3>
                      <p className="text-sm text-gray-600">Manage user roles and permissions</p>
                    </div>
                    {allUsers.map((userItem) => (
                      <div key={userItem._id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={userItem.avatar}
                              alt={`${userItem.firstName} ${userItem.lastName}`}
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {userItem.firstName} {userItem.lastName}
                              </h4>
                              <p className="text-sm text-gray-500">{userItem.email}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  userItem.role === 'admin' 
                                    ? 'bg-purple-100 text-purple-800'
                                    : userItem.role === 'participant'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {userItem.role === 'admin' && <Crown className="w-3 h-3 mr-1" />}
                                  {userItem.role}
                                </span>
                                {userItem.approvalRequestPending && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Pending
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {userItem.role !== 'admin' && userItem._id !== user.id && (
                              <button
                                onClick={() => promoteToAdmin(userItem._id)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                              >
                                <Crown className="w-4 h-4 mr-2" />
                                Promote to Admin
                              </button>
                            )}
                            {userItem.role === 'admin' && (
                              <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-md">
                                <Crown className="w-4 h-4 mr-2" />
                                Administrator
                              </span>
                            )}
                            {userItem._id === user.id && (
                              <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
