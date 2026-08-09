import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages, sendMessage, receiveMessage } from '../redux/messageSlice';
import socket from '../socket';

const ChatPanel = ({ isOpen, onClose, projectId, currentUserId }) => {
    const dispatch = useDispatch();
    const { messages, isLoading } = useSelector((state) => state.messages || { messages: [], isLoading: false });
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

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

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const resultAction = await dispatch(sendMessage({ projectId, content: newMessage }));
        
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
        <>
            {/* Backdrop on Mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-[#142820]/60 backdrop-blur-sm z-50 sm:hidden"
                    onClick={onClose}
                />
            )}

            <div
                className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] max-w-full bg-white shadow-2xl border-l border-[#E5ECE8] transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                } flex flex-col h-full`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E5ECE8] bg-[#FAF9F5] shrink-0">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#EBF3EE] text-[#1E3A2F] flex items-center justify-center font-bold shrink-0">
                            <MessageSquare size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </div>
                        <div>
                            <h2 className="text-xs sm:text-sm font-bold text-[#1E3A2F]">
                                Project Team Chat
                            </h2>
                            <p className="text-[10px] sm:text-[11px] text-emerald-800 flex items-center gap-1.5 font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                                Live WebSocket Room
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-[#1E3A2F] hover:bg-[#F4F2EC] transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#FAF9F5]/40">
                    {isLoading && messages.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="w-6 h-6 border-2 border-[#1E3A2F] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-[#6B7F76] text-center p-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#EBF3EE] text-[#1E3A2F] flex items-center justify-center mb-3">
                                <MessageSquare size={22} />
                            </div>
                            <p className="text-xs font-bold text-[#1E3A2F]">No messages yet</p>
                            <p className="text-[11px] text-[#6B7F76] mt-0.5">Start collaborating with your project team!</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isMine = msg.sender?._id === currentUserId;
                            const senderName = msg.sender?.name || 'Teammate';

                            return (
                                <div
                                    key={msg._id || index}
                                    className={`flex flex-col max-w-[88%] sm:max-w-[85%] ${
                                        isMine ? 'ml-auto items-end' : 'mr-auto items-start'
                                    }`}
                                >
                                    <span className="text-[9px] sm:text-[10px] font-bold text-[#6B7F76] mb-0.5 px-1 truncate max-w-[150px]">
                                        {isMine ? 'You' : senderName}
                                    </span>
                                    <div
                                        className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-sm ${
                                            isMine
                                                ? 'bg-[#1E3A2F] text-white rounded-tr-sm'
                                                : 'bg-white border border-[#E5ECE8] text-[#1A2421] rounded-tl-sm'
                                        }`}
                                    >
                                        <p className="text-xs leading-relaxed font-medium break-words">{msg.content}</p>
                                        <span className={`text-[8px] sm:text-[9px] mt-1 block text-right font-mono ${isMine ? 'text-white/70' : 'text-[#6B7F76]'}`}>
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
                <div className="p-3 sm:p-4 border-t border-[#E5ECE8] bg-white shrink-0">
                    <form
                        onSubmit={handleSendMessage}
                        className="flex items-center gap-2 bg-[#FAF9F5] p-1.5 rounded-2xl border border-[#D5DDD8] focus-within:border-[#1E3A2F] transition-all"
                    >
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Write a message..."
                            className="flex-1 bg-transparent border-none focus:outline-none px-3 sm:px-4 text-xs text-[#1A2421] placeholder-slate-400 min-w-0"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="p-2 sm:p-2.5 rounded-xl bg-[#1E3A2F] hover:bg-[#142820] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shrink-0"
                        >
                            <Send size={13} className="sm:w-3.5 sm:h-3.5" />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChatPanel;
