import axios from 'axios';
import { useEffect, useState } from 'react';
import Rating from 'react-rating';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_ENDPOINTS } from '../config/api';

function Ratings() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    async function postRating(value, vidid) {
        try {
            await axios.post(API_ENDPOINTS.rate, {
                rating: value,
                videoid: vidid
            });
            // Refresh videos after rating
            getAllVideos();
        } catch (error) {
            console.error("Error posting rating:", error);
            alert("Error posting rating. Please try again.");
        }
    }

    async function getAllVideos() {
        try {
            setLoading(true);
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

    function calculateAvg(arr) {
        if (!arr || arr.length === 0) return 0;
        const sum = arr.reduce((a, b) => a + b, 0);
        return (sum / arr.length).toFixed(1);
    }

    const renderVideos = videos.map((vid, index) => {
        return (
            <div key={vid._id || index} className='flex flex-col justify-center items-center bg-white rounded-lg shadow-md p-6 max-w-4xl w-full'>
                <video controls src={vid.videoUrl} className='w-full max-w-2xl rounded-lg'></video>
                <div className='mt-4 text-center'>
                    <p className='text-[#1308FE] font-bold text-xl pt-4'>{vid.name}</p>
                    <p className='text-gray-600 text-sm mt-2'>Age: {vid.age} | Address: {vid.address}</p>
                    <div className='mt-4'>
                        <p className='text-sm text-gray-600 mb-2'>Rate this performance:</p>
                        <Rating 
                            onChange={(value) => postRating(value, vid._id)} 
                            className='mb-4'
                        />
                    </div>
                    <div className='flex justify-center space-x-8 mt-4'>
                        <p className='text-sm'>Self Rating: <span className='font-bold text-blue-600'>{vid.rating} ⭐</span></p>
                        <p className='text-sm'>Audience Average: <span className='font-bold text-green-600'>{calculateAvg(vid.aboutPoints)} ⭐</span></p>
                    </div>
                </div>
            </div>
        );
    });

    useEffect(() => {
        getAllVideos();
    }, []);

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