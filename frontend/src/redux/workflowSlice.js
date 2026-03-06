import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPendingRequests = createAsyncThunk('workflow/fetchRequests', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth: { user } } = getState();
        const { data } = await axios.get('http://localhost:5001/api/workflow/requests', {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Error fetching requests');
    }
});

export const sendSupervisionRequest = createAsyncThunk('workflow/sendRequest', async (supervisorId, { getState, rejectWithValue }) => {
    try {
        const { auth: { user } } = getState();
        const { data } = await axios.post('http://localhost:5001/api/workflow/requests', { supervisorId }, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Error sending request');
    }
});

export const handleSupervisionRequest = createAsyncThunk('workflow/handleRequest', async ({ requestId, status }, { getState, rejectWithValue }) => {
    try {
        const { auth: { user } } = getState();
        const { data } = await axios.put(`http://localhost:5001/api/workflow/requests/${requestId}`, { status }, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Error handling request');
    }
});

const workflowSlice = createSlice({
    name: 'workflow',
    initialState: {
        requests: [],
        isLoading: false,
        error: null,
        successMessage: null
    },
    reducers: {
        clearWorkflowMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPendingRequests.pending, (state) => { state.isLoading = true; })
            .addCase(fetchPendingRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.requests = action.payload;
            })
            .addCase(fetchPendingRequests.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(sendSupervisionRequest.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(sendSupervisionRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.requests.push(action.payload);
                state.successMessage = 'Request sent successfully';
            })
            .addCase(sendSupervisionRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(handleSupervisionRequest.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(handleSupervisionRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.requests = state.requests.filter(req => req._id !== action.payload._id);
                state.successMessage = `Request ${action.payload.status}`;
            })
            .addCase(handleSupervisionRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearWorkflowMessages } = workflowSlice.actions;
export default workflowSlice.reducer;
