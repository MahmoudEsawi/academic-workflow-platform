import { io } from 'socket.io-client';

const URL = import.meta.env.MODE === 'production' ? undefined : 'http://localhost:5001';

const socket = io(URL, {
    autoConnect: false, // We'll connect manually when logged in
});

export default socket;
