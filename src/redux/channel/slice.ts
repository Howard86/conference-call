import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/server/user-service';
import { join, leave, activate } from './action';

interface ChannelState {
  activated: boolean;
  enabled: boolean;
  isLoading: boolean;
  users: User[];
  message?: string;
}

const initialState: ChannelState = {
  activated: false,
  enabled: false,
  isLoading: false,
  users: [],
};

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

const addUser = (state: ChannelState, action: PayloadAction<User>) => {
  const existed = state.users.some((user) => user.uid === action.payload.uid);
  if (!existed) {
    state.users = [...state.users, action.payload];
  }
};

const removeUser = (state: ChannelState, action: PayloadAction<string>) => {
  state.users = state.users.filter((user) => user.uid !== action.payload);
};

const { actions, reducer } = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    addOnlineUser: addUser,
    removeOnlineUser: removeUser,
  },
  extraReducers: (builder) => {
    builder
      .addCase(activate.fulfilled, (state) => {
        state.activated = true;
      })
      .addCase(join.pending, setLoading)
      .addCase(join.fulfilled, (state, action: PayloadAction<User>) => {
        setTrue(state);
        addUser(state, action);
      })
      .addCase(join.rejected, setFalse)
      .addCase(leave.pending, setLoading)
      .addCase(leave.fulfilled, (state, action: PayloadAction<string>) => {
        setFalse(state);
        removeUser(state, action);
        state.activated = false;
      })
      .addCase(leave.rejected, setTrue);
  },
});

export const { addOnlineUser, removeOnlineUser } = actions;

export default reducer;
