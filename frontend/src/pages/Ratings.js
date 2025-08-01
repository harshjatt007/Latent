import axios from 'axios';
import { useEffect, useState } from 'react';
import Rating from 'react-rating';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_ENDPOINTS } from '../config/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

function Ratings() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    // Check if user is authenticated and has audience role
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        if (user && user.role !== 'audience') {
            navigate('/unauthorized');
            return;
        }
    }, [isAuthenticated, user, navigate]);

    async function postRating(value, vidid) {
        // Check if user is authenticated
        if (!isAuthenticated || !user) {
            alert("Please sign in to rate videos");
            return;
        }

        // Check if user has audience role
        if (user.role !== 'audience') {
            alert("Only audience members can rate videos.");
            return;
        }

        try {
            console.log("Submitting rating:", value, "for video:", vidid);
            const response = await axios.post(API_ENDPOINTS.rate, {
                rating: value,
                videoid: vidid,
                userId: user.id // Use user.id instead of user._id
            });
            console.log("Rating response:", response.data);
            
            // Show success message
            alert(`Rating submitted successfully! Average rating: ${response.data.averageRating}/5`);
            
            // Refresh videos after rating
            getAllVideos();
        } catch (error) {
            console.error("Error posting rating:", error);
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert("Error posting rating. Please try again.");
            }
        }
    }

    async function getAllVideos() {
        try {
            setLoading(true);
            console.log("Fetching videos from:", API_ENDPOINTS.allVideos);
            const response = await axios.post(API_ENDPOINTS.allVideos);
            setVideos(response.data);
            console.log("Videos fetched:", response.data);
        } catch (error) {
            console.error("Error fetching videos:", error);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    }

    // Check if current user has already rated this video
    const hasUserRatedVideo = (video) => {
        if (!user || !video.ratings) return false;
        return video.ratings.some(rating => rating.userId === user.id);
    };

    const renderVideos = videos.map((vid, index) => {
        const userHasRated = hasUserRatedVideo(vid);
        const isOwnVideo = vid.uploadedBy && vid.uploadedBy._id === user?.id;
        
        return (
            <div key={vid._id || index} className='flex flex-col justify-center items-center bg-white rounded-lg shadow-md p-6 max-w-4xl w-full'>
                <video controls src={vid.videoUrl} className='w-full max-w-2xl rounded-lg'></video>
                <div className='mt-4 text-center'>
                    <p className='text-[#1308FE] font-bold text-xl pt-4'>{vid.name}</p>
                    <p className='text-gray-600 text-sm mt-2'>Age: {vid.age} | Address: {vid.address}</p>
                    {vid.uploadedBy && (
                        <p className='text-gray-500 text-xs mt-1'>
                            Uploaded by: {vid.uploadedBy.firstName} {vid.uploadedBy.lastName}
                        </p>
                    )}
                    
                    <div className='mt-4'>
                        {isOwnVideo ? (
                            <p className='text-sm text-gray-500 mb-2'>You cannot rate your own video</p>
                        ) : userHasRated ? (
                            <p className='text-sm text-green-600 mb-2'>You have already rated this video</p>
                        ) : (
                            <>
                                <p className='text-sm text-gray-600 mb-2'>Rate this performance:</p>
                                <Rating 
                                    onChange={(value) => postRating(value, vid._id)} 
                                    className='mb-4'
                                    emptySymbol="☆"
                                    fullSymbol="★"
                                    initialRating={0}
                                />
                            </>
                        )}
                    </div>
                    
                    <div className='flex justify-center space-x-8 mt-4'>
                        <p className='text-sm'>Self Rating: <span className='font-bold text-blue-600'>{vid.rating} ⭐</span></p>
                        <p className='text-sm'>
                            Audience Average: <span className='font-bold text-green-600'>
                                {vid.averageRating ? `${vid.averageRating} ⭐` : 'No ratings yet'}
                            </span>
                        </p>
                        <p className='text-sm'>
                            Total Votes: <span className='font-bold text-purple-600'>{vid.totalRatings || 0}</span>
                        </p>
                    </div>
                    
                    {/* Display about points if they exist */}
                    {vid.aboutPoints && vid.aboutPoints.length > 0 && (
                        <div className='mt-4'>
                            <p className='text-sm text-gray-600 mb-2'>About this contestant:</p>
                            <div className='flex flex-wrap justify-center gap-2'>
                                {vid.aboutPoints.map((point, idx) => (
                                    <span key={idx} className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded'>
                                        {point}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    });

    useEffect(() => {
        if (isAuthenticated && user && user.role === 'audience') {
            getAllVideos();
        }
    }, [isAuthenticated, user]);

    // Show loading or unauthorized message
    if (!isAuthenticated || !user) {
        return <div className='flex justify-center items-center min-h-screen'>Loading...</div>;
    }

    if (user.role !== 'audience') {
        return <div className='flex justify-center items-center min-h-screen'>Redirecting...</div>;
    }

    return (
        <div className='bg-[#FFFFFF] w-full min-h-screen'>
            <Navbar />
            <div className='pt-[80px] pb-10'>
                <p className='text-[#1308FE] font-bold text-[35px] text-center'>Rate Contestants</p>
                <p className='text-[#1308FE] font-bold text-[20px] text-center pt-[10px]'>Rate Your Favourite Contestants And Make them win</p>
                
                {loading ? (
                    <div className='flex justify-center items-center pt-[60px]'>
                        <p className='text-gray-600'>Loading videos...</p>
                    </div>
                ) : videos.length === 0 ? (
                    <div className='flex justify-center items-center pt-[60px]'>
                        <p className='text-gray-600'>No videos uploaded yet. Check back later!</p>
                    </div>
                ) : (
                    <div className='flex flex-col justify-center pl-[10px] pt-[60px] gap-16 items-center'>
                        {renderVideos}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Ratings;