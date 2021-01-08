import { createSlice } from '@reduxjs/toolkit';
import { join, leave } from './action';

interface ChannelState {
  enabled: boolean;
  userId?: string;
  message?: string;
}

const initialState: ChannelState = { enabled: false };

const setTrue = (state: ChannelState) => {
  state.enabled = true;
};

const setFalse = (state: ChannelState) => {
  state.enabled = false;
};

export const { reducer } = createSlice({
  name: 'channel',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(join.pending, setTrue)
      .addCase(join.rejected, setFalse)
      .addCase(leave.fulfilled, setTrue)
      .addCase(leave.rejected, setFalse);
  },
});
