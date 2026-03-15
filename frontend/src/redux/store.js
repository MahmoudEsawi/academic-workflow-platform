import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import projectReducer from './projectSlice';
import workflowReducer from './workflowSlice';
import messageReducer from './messageSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        project: projectReducer,
        workflow: workflowReducer,
        messages: messageReducer,
    },
});
