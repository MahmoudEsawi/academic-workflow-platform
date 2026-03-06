import React, { useState, useEffect } from 'react';
import socket from '../socket';
import { Activity, CircleDashed } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const LiveTeamHub = () => {
    const [stream, setStream] = useState([
        { id: '1', message: 'Team Hub connected and listening for live updates...', timestamp: new Date().toISOString(), type: 'system' }
    ]);
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);
        const onActivityUpdate = (data) => {
            // Prepend new activity
            setStream(prev => [{
                ...data,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString()
            }, ...prev].slice(0, 50)); // Keep last 50 events
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('receive_activity_update', onActivityUpdate);

        // Listen to task updates too to make it feel alive immediately
        socket.on('taskUpdated', (task) => {
            onActivityUpdate({
                message: `Task "${task.title}" updated to ${task.status}`,
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
            case 'task': return 'bg-blue-100 text-blue-600';
            case 'proposal': return 'bg-green-100 text-green-600';
            case 'system': return 'bg-slate-100 text-slate-500';
            default: return 'bg-indigo-100 text-indigo-600';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-8rem)] sticky top-8 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm">
                        <Activity size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800">Live Team Hub</h3>
                </div>
                <div className={`flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <span className="relative flex h-2 w-2">
                        {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </span>
                    {isConnected ? 'Live' : 'Reconnecting'}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 scroll-smooth">
                {stream.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <CircleDashed className="animate-spin mb-3" size={24} />
                        <p className="text-sm font-medium">Waiting for activity...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {stream.map((event, index) => (
                            <div key={event.id} className="relative flex gap-4 group">
                                {/* Timeline Line */}
                                {index !== stream.length - 1 && (
                                    <div className="absolute top-8 bottom-[-24px] left-[15px] w-px bg-slate-200"></div>
                                )}

                                <div className={`relative z-10 shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-white ring-4 ring-white ${getIconColor(event.type)}`}>
                                    <div className="w-2 h-2 rounded-full bg-current"></div>
                                </div>
                                <div className="flex flex-col pt-1.5 pb-2">
                                    <p className="text-sm font-medium text-slate-800 leading-snug">
                                        {event.message}
                                    </p>
                                    <span className="text-xs font-semibold text-slate-400 mt-1">
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
