import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

export const logout = createAction<void>('user/logout');

export const login = createAsyncThunk(
  'user/login',
  async (password: string) => {
    const result = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { success } = await result.json();
    return success;
  },
);
