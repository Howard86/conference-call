import { createSlice } from '@reduxjs/toolkit';

interface ChannelState {
  enabled: boolean;
  userId?: string;
  message?: string;
}

const initialState: ChannelState = { enabled: false };

export const { actions, reducer } = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    join(state) {
      state.enabled = true;
    },
    leave(state) {
      state.enabled = false;
    },
  },
});
