import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { postLocal } from '../api';

export const logout = createAction<void>('user/logout');

export const login = createAsyncThunk(
  'user/login',
  async (password: string) => {
    const { success } = await postLocal('login', {
      password,
    });

    return success;
  },
);
