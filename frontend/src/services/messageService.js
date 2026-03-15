import axios from 'axios';

// Since we are proxying in vite or explicitly setting the backend URL
const API_URL = import.meta.env.MODE === 'production' ? '/api/messages' : 'http://localhost:5001/api/messages';

// Get messages for a project
const getMessages = async (projectId) => {
    const response = await axios.get(`${API_URL}/${projectId}`);
    return response.data;
};

// Send a new message
const sendMessage = async (projectId, messageData) => {
    const response = await axios.post(`${API_URL}/${projectId}`, messageData);
    return response.data;
};

const messageService = {
    getMessages,
    sendMessage,
};

export default messageService;
