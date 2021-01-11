import type { RootState } from '../store';
import { UserState } from './slice';

export const selectUser = (state: RootState): UserState => state.user;
