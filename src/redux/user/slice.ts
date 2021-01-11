import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/server/user-service';
import { join } from '../channel';
import { login } from './action';
import { leave } from '@/redux/channel';

export interface UserState {
  isLoggedIn: boolean;
  username: string;
  uid: string;
}

const setLoggedOut = (state: UserState) => {
  state.isLoggedIn = false;
};

const initialState: UserState = {
  isLoggedIn: false,
  username: '',
  uid: '',
};

const { reducer, actions } = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: setLoggedOut,
    updateUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    updateUID(state, action: PayloadAction<string>) {
      state.uid = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.isLoggedIn = action.payload;
      })
      .addCase(login.rejected, setLoggedOut)
      .addCase(join.fulfilled, (state, action: PayloadAction<User>) => {
        state.uid = action.payload.uid;
        state.username = action.payload.username;
      })
      .addCase(leave.fulfilled, () => initialState);
  },
});

export const { updateUID, updateUsername, logout } = actions;

export default reducer;
