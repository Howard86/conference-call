import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { reducer as channel } from './channel/slice';

const store = configureStore({
  reducer: {
    channel,
  },
  devTools: process.env.NODE_ENV === 'development',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<R = void> = ThunkAction<
  R,
  RootState,
  unknown,
  Action<string>
>;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export default store;
