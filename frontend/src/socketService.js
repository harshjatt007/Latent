// src/socketService.js
import { io } from 'socket.io-client';

// Connect to the Socket.IO server (use your deployed backend URL)
const socket = io('https://latent-kk5m.onrender.com');

// Optionally, you can export specific events like sendNotification as well
export const sendNotification = () => {
  socket.emit('sendNotification');
};

export { socket }; // Export socket instance
