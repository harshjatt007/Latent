import axios from 'axios';
import { useEffect, useState } from 'react';
import Rating from 'react-rating';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import UserAvatar from '../components/UserAvatar';

function Ratings() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    async function postRating(value, vidid) {
        if (!user) return toast.error("You must be logged in to rate.");
        try {
            const response = await axios.post(API_ENDPOINTS.rate, {
                rating: value, videoid: vidid, userId: user?._id || user?.id
            });
            if (response.data.success) {
              toast.success("Vote recorded!");
              fetchOngoingVideos();
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Error posting rating.");
        }
    }

    async function fetchOngoingVideos() {
        try {
            setLoading(true);
            const response = await axios.get(API_ENDPOINTS.battleSummary);
            if (response.data.success) setVideos(response.data.ongoing);
        } catch (error) {
            console.error("Error fetching ongoing videos:", error);
        } finally { setLoading(false); }
    }

    useEffect(() => {
        if (user && user.role === 'contestant') { navigate('/dashboard'); return; }
        fetchOngoingVideos();
    }, [user, navigate]);

    function calculateAvg(arr) {
        if (!arr || arr.length === 0) return 0;
        return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
    }

    return (
        <div className='bg-white dark:bg-gray-950 w-full min-h-screen transition-colors duration-500'>
            <Navbar />
            <div className='pt-[120px] pb-20 container mx-auto px-4'>
                <div className="text-center mb-16">
                    <h1 className='text-gray-900 dark:text-white font-black text-5xl md:text-7xl tracking-tighter uppercase italic'>Rate Contestants</h1>
                    <p className='text-gray-500 dark:text-gray-400 font-bold text-xl md:text-2xl mt-4 tracking-tight'>Support your favorites and help them win the show</p>
                </div>
                
                {loading ? (
                    <div className='flex flex-col justify-center items-center py-20 gap-4'>
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className='text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs'>Scanning Talents...</p>
                    </div>
                ) : videos.length === 0 ? (
                    <div className='bg-white dark:bg-gray-900 rounded-[3rem] p-20 text-center shadow-xl border border-gray-100 dark:border-gray-800'>
                        <p className='text-gray-500 dark:text-gray-400 text-2xl font-bold italic tracking-tight'>No videos uploaded yet. Check back later!</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {videos.map((vid, index) => (
                            <motion.div 
                                key={vid._id || index}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className='group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300'
                            >
                                <div className='w-full relative bg-gray-950 aspect-video'>
                                    <video 
                                        controls 
                                        src={vid.videoUrl ? (vid.videoUrl.startsWith('http') ? vid.videoUrl : `${API_BASE_URL}/${vid.videoUrl}`) : ""} 
                                        className='w-full h-full object-cover'
                                        onPlay={(e) => { document.querySelectorAll('video').forEach(v => { if (v !== e.target && !v.paused) v.pause(); }); }}
                                    ></video>
                                    <div className="absolute top-3 left-3 z-20">
                                        <div className="px-2.5 py-1 bg-black/50 backdrop-blur-md text-white font-bold text-[9px] rounded-md tracking-wider uppercase">#{index + 1}</div>
                                    </div>
                                </div>

                                <div className='p-4'>
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <UserAvatar name={vid.name} size="w-8 h-8" textClass="text-[10px]" />
                                        <div className="min-w-0">
                                            <h3 className='text-sm font-extrabold text-gray-900 dark:text-white truncate leading-tight'>{vid.name}</h3>
                                            <p className='text-[10px] text-gray-400 font-medium'>Age {vid.age} · {vid.address}</p>
                                        </div>
                                    </div>

                                    <div className='mb-4 flex justify-center'>
                                        {vid.votedBy?.includes(user?._id || user?.id) ? (
                                            <div className="w-full text-center py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl">
                                                <p className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">✓ Vote Recorded</p>
                                            </div>
                                        ) : (
                                            <Rating 
                                                onChange={(value) => postRating(value, vid._id)} 
                                                className='text-3xl'
                                                emptySymbol={<span className="text-gray-200 dark:text-gray-700 mx-1 cursor-pointer transition-transform hover:scale-125 block">★</span>}
                                                fullSymbol={<span className="text-yellow-400 mx-1 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] transition-transform hover:scale-125 block">★</span>}
                                            />
                                        )}
                                    </div>

                                    <div className='flex items-center justify-around bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3 py-3'>
                                        {vid.votedBy?.includes(user?._id || user?.id) ? (
                                            <>
                                                <div className="text-center">
                                                    <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1'>Audience Score</p>
                                                    <p className='text-xl font-black text-emerald-500'>{calculateAvg(vid.ratings || [])}<span className="text-xs ml-0.5 opacity-60">/5</span></p>
                                                </div>
                                                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                                                <div className="text-center">
                                                    <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1'>Total Votes</p>
                                                    <p className='text-xl font-black text-gray-700 dark:text-gray-300'>{vid.ratings?.length || 0}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center w-full">
                                                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Score Hidden</p>
                                                <p className='text-xs font-medium text-gray-400 mt-1'>Vote to reveal current standing</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Ratings;