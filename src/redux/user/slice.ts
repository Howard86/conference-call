import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login } from './action';

interface UserState {
  isLoggedIn: boolean;
  uid: string;
}

const setLoggedOut = (state: UserState) => {
  state.isLoggedIn = false;
};

const initialState: UserState = {
  isLoggedIn: false,
  uid: '',
};

const { reducer, actions } = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: setLoggedOut,
    updateUID(state, action: PayloadAction<string>) {
      state.uid = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.isLoggedIn = action.payload;
      })
      .addCase(login.rejected, setLoggedOut);
  },
});

export const { updateUID, logout } = actions;

export default reducer;
