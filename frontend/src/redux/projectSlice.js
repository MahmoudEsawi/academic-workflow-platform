import { createSlice } from '@reduxjs/toolkit';

const projectSlice = createSlice({
    name: 'project',
    initialState: {
        projects: [],
        currentProject: null,
        tasks: [],
    },
    reducers: {
        setProjects: (state, action) => {
            state.projects = action.payload;
        },
        setCurrentProject: (state, action) => {
            state.currentProject = action.payload;
        },
        setTasks: (state, action) => {
            state.tasks = action.payload;
        },
        updateTaskInStore: (state, action) => {
            const index = state.tasks.findIndex((t) => t._id === action.payload._id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        },
        addTaskToStore: (state, action) => {
            state.tasks.push(action.payload);
        },
        removeTaskFromStore: (state, action) => {
            state.tasks = state.tasks.filter((t) => t._id !== action.payload);
        },
        updateProjectStatusInStore: (state, action) => {
            if (state.currentProject && state.currentProject._id === action.payload._id) {
                state.currentProject.status = action.payload.status;
            }
            const index = state.projects.findIndex((p) => p._id === action.payload._id);
            if (index !== -1) {
                state.projects[index].status = action.payload.status;
            }
        }
    },
});

export const {
    setProjects,
    setCurrentProject,
    setTasks,
    updateTaskInStore,
    addTaskToStore,
    removeTaskFromStore,
    updateProjectStatusInStore
} = projectSlice.actions;
export default projectSlice.reducer;
