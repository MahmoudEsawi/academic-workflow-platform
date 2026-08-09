import React, { useState, useEffect } from 'react';
import socket from '../socket';
import { Activity, CircleDashed, Sparkles, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const LiveTeamHub = () => {
    const [stream, setStream] = useState([
        { id: '1', message: 'Team Hub connected and streaming real-time events...', timestamp: new Date().toISOString(), type: 'system' },
        { id: '2', message: 'Dr. Robert Smith approved Task 4 (AES-256 Auth)', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'proposal' },
        { id: '3', message: 'Alice Chen pushed Version 1 Code Deliverable', timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'task' }
    ]);
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);
        const onActivityUpdate = (data) => {
            setStream(prev => [{
                ...data,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString()
            }, ...prev].slice(0, 50));
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('receive_activity_update', onActivityUpdate);

        socket.on('taskUpdated', (task) => {
            onActivityUpdate({
                message: `Task "${task.title}" moved to ${task.status}`,
                type: 'task'
            });
        });

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('receive_activity_update', onActivityUpdate);
            socket.off('taskUpdated');
        };
    }, []);

    const getIconColor = (type) => {
        switch (type) {
            case 'task': return 'bg-[#EBF3EE] text-[#1E3A2F] border-[#D1E7DD]';
            case 'proposal': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
            case 'system': return 'bg-[#FAF9F5] text-[#596F65] border-[#E5ECE8]';
            default: return 'bg-[#EBF3EE] text-[#1E3A2F] border-[#D1E7DD]';
        }
    };

    return (
        <div className="bg-white rounded-[1.75rem] sm:rounded-[2rem] shadow-sm border border-[#E5ECE8] flex flex-col h-[340px] lg:h-[calc(100vh-8rem)] lg:sticky lg:top-24 overflow-hidden">
            {/* Header */}
            <div className="bg-[#FAF9F5] border-b border-[#E5ECE8] p-4 sm:p-5 flex items-center justify-between z-10">
                <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#1E3A2F] text-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                        <Activity size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#1E3A2F] text-xs sm:text-sm">Live Activity Hub</h3>
                        <p className="text-[10px] sm:text-[11px] text-[#6B7F76]">Real-time WebSocket stream</p>
                    </div>
                </div>
                <div className={`flex items-center gap-1.5 text-[9px] sm:text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    isConnected
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                    <span className="relative flex h-2 w-2">
                        {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                    </span>
                    {isConnected ? 'LIVE' : 'OFFLINE'}
                </div>
            </div>

            {/* Event Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
                {stream.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-[#6B7F76]">
                        <CircleDashed className="animate-spin mb-3" size={24} />
                        <p className="text-xs font-medium">Waiting for team activity...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {stream.map((event) => (
                            <div key={event.id} className="relative flex gap-2.5 sm:gap-3 group">
                                <div className={`relative z-10 shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center justify-center border text-xs ${getIconColor(event.type)}`}>
                                    <Sparkles size={12} />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <p className="text-[11px] sm:text-xs font-medium text-[#1A2421] leading-snug break-words">
                                        {event.message}
                                    </p>
                                    <span className="text-[9px] sm:text-[10px] text-[#6B7F76] mt-0.5 flex items-center gap-1">
                                        <Clock size={10} />
                                        {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveTeamHub;
