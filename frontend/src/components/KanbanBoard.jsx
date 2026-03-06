import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskInStore } from '../redux/projectSlice';
import socket from '../socket';
import axios from 'axios';

const COLUMNS = ['To Do', 'In Progress', 'Review', 'Done'];

const KanbanBoard = ({ projectId, tasks }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [boardData, setBoardData] = useState({});

    useEffect(() => {
        // Group tasks by status
        const initialData = {};
        COLUMNS.forEach((col) => {
            initialData[col] = tasks
                .filter((t) => t.status === col)
                .sort((a, b) => a.position - b.position);
        });
        setBoardData(initialData);
    }, [tasks]);

    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceCol = [...boardData[source.droppableId]];
        const destCol = source.droppableId === destination.droppableId ? sourceCol : [...boardData[destination.droppableId]];

        const [movedTask] = sourceCol.splice(source.index, 1);
        movedTask.status = destination.droppableId;
        movedTask.position = destination.index;

        destCol.splice(destination.index, 0, movedTask);

        const newBoardData = {
            ...boardData,
            [source.droppableId]: sourceCol,
            [destination.droppableId]: destCol,
        };

        setBoardData(newBoardData);

        // Optimistic update in redux
        dispatch(updateTaskInStore(movedTask));

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/tasks/${movedTask._id}`,
                { status: movedTask.status, position: movedTask.position },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error('Error updating task', error);
            // Revert in case of error (can be improved)
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
                {COLUMNS.map((columnId) => (
                    <div key={columnId} className="bg-gray-100 rounded-lg p-4 min-w-[300px] flexflex-col">
                        <h3 className="font-semibold text-gray-700 mb-4">{columnId}</h3>
                        <Droppable droppableId={columnId}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`flex-1 min-h-[200px] rounded-md p-2 ${snapshot.isDraggingOver ? 'bg-indigo-50' : ''
                                        }`}
                                >
                                    {boardData[columnId]?.map((task, index) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`bg-white p-4 rounded shadow-sm mb-3 border border-gray-200 ${snapshot.isDragging ? 'shadow-md border-indigo-400' : ''
                                                        }`}
                                                >
                                                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                                                    {task.description && (
                                                        <p className="text-sm text-gray-500 mt-1 truncate">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                    {task.assignedTo && (
                                                        <div className="mt-3 text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded inline-block">
                                                            {task.assignedTo?.name || 'Assigned'}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
