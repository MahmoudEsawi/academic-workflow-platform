import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User as UserIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages, sendMessage, receiveMessage } from '../redux/messageSlice';
import socket from '../socket';

const ChatPanel = ({ isOpen, onClose, projectId, currentUserId }) => {
    const dispatch = useDispatch();
    // Safely select chat state, fallback to empty array if undefined
    const { messages, isLoading } = useSelector((state) => state.messages || { messages: [], isLoading: false });
    const { user } = useSelector((state) => state.auth || { user: null });
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Initial fetch and socket setup
    useEffect(() => {
        if (isOpen && projectId) {
            dispatch(getMessages(projectId));

            const handleReceiveMessage = (message) => {
                dispatch(receiveMessage(message));
            };

            socket.on('receiveMessage', handleReceiveMessage);

            return () => {
                socket.off('receiveMessage', handleReceiveMessage);
            };
        }
    }, [isOpen, projectId, dispatch]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Dispatch the API call which adds it to our local state upon success
        const resultAction = await dispatch(sendMessage({ projectId, content: newMessage }));
        
        // Emitting the socket event for other users in the room
        if (sendMessage.fulfilled.match(resultAction)) {
             socket.emit('sendMessage', { 
                 projectId, 
                 message: resultAction.payload 
             });
        }

        setNewMessage('');
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div
            className={`fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            } flex flex-col`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Project Chat
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 dark:hover:text-slate-200 dark:hover:bg-slate-700/50 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {isLoading && messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="w-6 h-6 border-2 border-[#00244D] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">
                        <UserIcon size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">No messages yet.</p>
                        <p className="text-xs">Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMine = msg.sender?._id === currentUserId;
                        const senderName = msg.sender?.name || 'Unknown User';

                        return (
                            <div
                                key={msg._id || index}
                                className={`flex flex-col max-w-[85%] ${
                                    isMine ? 'ml-auto items-end' : 'mr-auto items-start'
                                }`}
                            >
                                <span className="text-xs text-slate-500 mb-1 ml-1 truncate max-w-xs block">
                                    {isMine ? 'You' : senderName}
                                </span>
                                <div
                                    className={`px-4 py-2 rounded-2xl ${
                                        isMine
                                            ? 'bg-[#00244D] text-white rounded-tr-sm shadow-sm'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm'
                                    }`}
                                >
                                    <p className="text-sm py-1 font-medium">{msg.content}</p>
                                    <span className={`text-[10px] mt-1 block text-right ${isMine ? 'text-slate-300' : 'text-slate-400'}`}>
                                        {formatTime(msg.createdAt)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-full border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#00244D]/20 focus-within:border-[#00244D] transition-all"
                >
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-sm text-slate-800 dark:text-slate-200 h-9"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 rounded-full bg-[#00244D] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#003366] transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPanel;
