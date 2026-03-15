import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messageService from '../services/messageService';

const initialState = {
    messages: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Fetch messages for a project
export const getMessages = createAsyncThunk(
    'messages/getMessages',
    async (projectId, thunkAPI) => {
        try {
            return await messageService.getMessages(projectId);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Send a message
export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async ({ projectId, content }, thunkAPI) => {
        try {
            return await messageService.sendMessage(projectId, { content });
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        // Action to receive a message via Socket.io
        receiveMessage: (state, action) => {
            // Check if the message is already in the list (sometimes they bounce back via API before socket or vice-versa)
            const exists = state.messages.find((m) => m._id === action.payload._id);
            if (!exists) {
                state.messages.push(action.payload);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMessages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.messages = action.payload; // Set the full payload of messages
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(sendMessage.pending, (state) => {
                // Not showing overall loading state for sending message typically (optimistic UI could go here)
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                // When we create a message, the API returns the populated message.
                // We add it to our state here. (We also emit it via socket in the component)
                state.messages.push(action.payload);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, receiveMessage } = messageSlice.actions;
export default messageSlice.reducer;
