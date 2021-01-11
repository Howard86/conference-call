import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/server/user-service';
import type { ChannelState } from './slice';

export const setTrue = (state: ChannelState): void => {
  state.enabled = true;
  state.isLoading = false;
};

export const setFalse = (state: ChannelState): void => {
  state.enabled = false;
  state.isLoading = false;
};

export const setLoading = (state: ChannelState): void => {
  state.isLoading = true;
};

export const addUser = (
  state: ChannelState,
  action: PayloadAction<User>,
): void => {
  const existed = state.users.some((user) => user.uid === action.payload.uid);
  if (!existed) {
    state.users = [...state.users, action.payload];
  }
};

export const removeUser = (
  state: ChannelState,
  action: PayloadAction<string>,
): void => {
  state.users = state.users.filter((user) => user.uid !== action.payload);
};
