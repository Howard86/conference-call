import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/server/user';
import { addUser, removeUser, setLoading, setTrue, setFalse } from './utils';
import { join, leave, activate, updateAccessToken } from './action';

export interface ChannelState {
  activated: boolean;
  enabled: boolean;
  isLoading: boolean;
  users: User[];
  token: string;
  message?: string;
}

const initialState: ChannelState = {
  activated: false,
  enabled: false,
  isLoading: false,
  users: [],
  token: '',
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
      .addCase(leave.rejected, setTrue)
      .addCase(
        updateAccessToken.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.token = action.payload;
        },
      );
  },
});

export const { addOnlineUser, removeOnlineUser } = actions;

export default reducer;
