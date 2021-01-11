import { createSlice } from '@reduxjs/toolkit';
import { join, leave } from './action';

interface ChannelState {
  enabled: boolean;
  isLoading: boolean;
  userId?: string;
  message?: string;
}

const initialState: ChannelState = { enabled: false, isLoading: false };

const setTrue = (state: ChannelState) => {
  state.enabled = true;
  state.isLoading = false;
};

const setFalse = (state: ChannelState) => {
  state.enabled = false;
  state.isLoading = false;
};

const setLoading = (state: ChannelState) => {
  state.isLoading = true;
};

export const { reducer } = createSlice({
  name: 'channel',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(join.pending, setLoading)
      .addCase(join.fulfilled, setTrue)
      .addCase(join.rejected, setFalse)
      .addCase(leave.pending, setLoading)
      .addCase(leave.fulfilled, setFalse)
      .addCase(leave.rejected, setTrue);
  },
});
