import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../store/authStore';


const Profile = () => {
  // Get user data from auth store
  const { user } = useAuthStore();
  
  // Initialize user details from auth store user data
  const initialUserDetails = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || "https://avatar.iran.liara.run/public",
  };

  // State to manage user details
  const [userDetails, setUserDetails] = useState(initialUserDetails);
  const [isEditing, setIsEditing] = useState(false);

  // Update userDetails when user data changes
  React.useEffect(() => {
    if (user) {
      setUserDetails({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || "https://avatar.iran.liara.run/public",
      });
    }
  }, [user]);

  // Handle changes to user details
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  // Toggle editing mode
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  // Save the changes
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/auth/updateProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('User details saved:', data);
        alert('Profile updated successfully!');
        setIsEditing(false);
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-lg mx-auto bg-white p-6 mt-40 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">User Profile</h2>

        <div className="space-y-4">
          {/* Avatar Display */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              <img
                src={userDetails.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* First Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={userDetails.firstName}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            ) : (
              <p className="mt-1 text-gray-900">{userDetails.firstName}</p>
            )}
          </div>

          {/* Last Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={userDetails.lastName}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            ) : (
              <p className="mt-1 text-gray-900">{userDetails.lastName}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={userDetails.email}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            ) : (
              <p className="mt-1 text-gray-900">{userDetails.email}</p>
            )}
          </div>

          {/* Bio Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={userDetails.bio}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                rows="4"
              />
            ) : (
              <p className="mt-1 text-gray-900">{userDetails.bio}</p>
            )}
          </div>

          {/* Edit/Save Button */}
          <div className="flex justify-end space-x-4 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={toggleEditing}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={toggleEditing}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;