import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskInStore } from '../redux/projectSlice';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Eye, User, Layers } from 'lucide-react';
import axios from 'axios';

const COLUMNS = ['To Do', 'In Progress', 'Review', 'Done'];

const columnConfig = {
    'To Do': {
        color: 'text-[#4A5D54]',
        badge: 'bg-[#F4F2EC] text-[#1E3A2F] border-[#E5ECE8]',
        border: 'border-[#E5ECE8]',
        accent: 'bg-[#6B7F76]'
    },
    'In Progress': {
        color: 'text-[#1E3A2F]',
        badge: 'bg-blue-50 text-blue-800 border-blue-200',
        border: 'border-blue-200',
        accent: 'bg-blue-600'
    },
    'Review': {
        color: 'text-amber-800',
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
        border: 'border-amber-200',
        accent: 'bg-amber-600'
    },
    'Done': {
        color: 'text-emerald-800',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        border: 'border-emerald-200',
        accent: 'bg-emerald-600'
    }
};

const KanbanBoard = ({ projectId, tasks }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [boardData, setBoardData] = useState({});

    useEffect(() => {
        const initialData = {};
        COLUMNS.forEach((col) => {
            initialData[col] = (tasks || [])
                .filter((t) => t.status === col)
                .sort((a, b) => a.position - b.position);
        });
        setBoardData(initialData);
    }, [tasks]);

    const onDragEnd = async (result) => {
        const { source, destination } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceCol = [...(boardData[source.droppableId] || [])];
        const destCol = source.droppableId === destination.droppableId ? sourceCol : [...(boardData[destination.droppableId] || [])];

        const [movedTask] = sourceCol.splice(source.index, 1);
        if (!movedTask) return;

        movedTask.status = destination.droppableId;
        movedTask.position = destination.index;

        destCol.splice(destination.index, 0, movedTask);

        const newBoardData = {
            ...boardData,
            [source.droppableId]: sourceCol,
            [destination.droppableId]: destCol,
        };

        setBoardData(newBoardData);
        dispatch(updateTaskInStore(movedTask));

        try {
            await axios.put(
                `http://localhost:5001/api/tasks/${movedTask._id}`,
                { status: movedTask.status, position: movedTask.position }
            );
        } catch (error) {
            console.error('Error updating task status', error);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {/* Scrollable Container on Mobile, Grid on Desktop */}
            <div className="flex md:grid md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 pb-6 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory">
                {COLUMNS.map((columnId) => {
                    const cfg = columnConfig[columnId];
                    const items = boardData[columnId] || [];

                    return (
                        <div 
                            key={columnId} 
                            className="bg-[#FAF9F5] rounded-[1.75rem] sm:rounded-[2rem] p-3.5 sm:p-4 border border-[#E5ECE8] flex flex-col min-h-[420px] sm:min-h-[460px] min-w-[280px] sm:min-w-[300px] md:min-w-0 snap-center shrink-0 md:shrink"
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between px-2 py-2 mb-3">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${cfg.accent}`}></div>
                                    <h3 className="font-bold text-[#1E3A2F] text-xs sm:text-sm">{columnId}</h3>
                                </div>
                                <span className={`text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border ${cfg.badge}`}>
                                    {items.length}
                                </span>
                            </div>

                            {/* Droppable Area */}
                            <Droppable droppableId={columnId}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 rounded-2xl p-1.5 sm:p-2 transition-colors flex flex-col gap-3 ${
                                            snapshot.isDraggingOver ? 'bg-[#EBF3EE] border-2 border-dashed border-[#A3CFBB]' : ''
                                        }`}
                                    >
                                        {items.length === 0 && !snapshot.isDraggingOver && (
                                            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-[#E5ECE8] rounded-xl p-4 text-center">
                                                <p className="text-[11px] text-[#6B7F76] italic">No tasks in {columnId}</p>
                                            </div>
                                        )}

                                        {items.map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`bg-white p-3.5 sm:p-4 rounded-2xl border transition-all ${
                                                            snapshot.isDragging
                                                                ? 'shadow-2xl border-[#1E3A2F] ring-2 ring-[#1E3A2F]/20 scale-105 z-50'
                                                                : 'border-[#E5ECE8] hover:border-[#CBDCD4] shadow-sm'
                                                        }`}
                                                    >
                                                        <h4 className="font-bold text-[#1E3A2F] text-xs sm:text-sm leading-snug break-words">
                                                            {task.title}
                                                        </h4>
                                                        {task.description && (
                                                            <p className="text-[11px] sm:text-xs text-[#596F65] mt-1.5 line-clamp-2 leading-relaxed break-words">
                                                                {task.description}
                                                            </p>
                                                        )}

                                                        <div className="mt-3.5 pt-3 border-t border-[#F0EFEA] flex items-center justify-between gap-2 flex-wrap">
                                                            {task.assignedTo ? (
                                                                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#1E3A2F] bg-[#EBF3EE] px-2 py-0.5 rounded-lg border border-[#D1E7DD] truncate max-w-[120px]">
                                                                    <User size={11} className="text-[#3E735E] shrink-0" />
                                                                    <span className="truncate">{task.assignedTo?.name || 'Assigned'}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[10px] sm:text-[11px] text-[#6B7F76] italic">Unassigned</span>
                                                            )}

                                                            {user?.role === 'Student' && (
                                                                <Link
                                                                    to={`/workspace/${task._id}`}
                                                                    className="text-[11px] sm:text-xs font-bold text-[#1E3A2F] hover:text-[#142820] flex items-center gap-1 bg-[#FAF9F5] hover:bg-[#EBF3EE] px-2.5 py-1 rounded-lg border border-[#E5ECE8] transition-all shrink-0"
                                                                >
                                                                    <span>Workspace</span>
                                                                    <ArrowUpRight size={12} />
                                                                </Link>
                                                            )}
                                                            {(user?.role === 'Supervisor' || user?.role === 'Admin') && (
                                                                <Link
                                                                    to={`/review/${task._id}`}
                                                                    className="text-[11px] sm:text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-all shrink-0"
                                                                >
                                                                    <span>Review</span>
                                                                    <Eye size={12} />
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
