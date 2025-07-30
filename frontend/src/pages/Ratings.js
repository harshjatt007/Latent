import axios from 'axios';
import { useEffect, useState } from 'react';
import Rating from 'react-rating';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Ratings() {
    const [videos, setVideos] = useState([]);

    async function postRating(value, vidid) {
        await axios.post(`http://localhost:5000/rate`, {
            rating: value,
            videoid: vidid
        })
    }

    async function getAllVideos() {
        const response = await axios.post(`http://localhost:5000/allVideos`);
        setVideos(response.data);
        console.log(response.data);
    }

    function calculateAvg(arr) {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return (sum / arr.length).toFixed(1);
    }

    const renderVideos = videos.map((vid) => {
        return <div className='flex flex-col justify-center items-center'>
            <video controls src={vid.videoUrl} className='w-[800px]'></video>
            <p className='text-[#1308FE] font-bold pt-4'>{vid.name}</p>
            <Rating onChange={(value) => postRating(value, vid._id)} />
            <p>Self Rating : {vid.rating} ⭐</p>
            <p>Audience Average Rating : {calculateAvg(vid.aboutPoints)} ⭐</p>
        </div>
    })

    useEffect(() => {
        getAllVideos();
    }, [])

    return (
        <div className='bg-[#FFFFFF] w-full h-full'>
            <Navbar />
            <p className='text-[#1308FE] font-bold text-[35px] text-center pt-[80px]'>Rate Contestants</p>
            <p className='text-[#1308FE] font-bold text-[20px] text-center pt-[10px]'>Rate Your Favourite Contestants And Make them win</p>
            <div className='flex flex-col justify-center pl-[10px] pt-[60px] gap-16 items-center pb-10'>
                {renderVideos}
            </div>
            <Footer />
        </div>);
}
export default Ratings;