import type { RootState } from '@/redux/store';

export const selectJoined = (state: RootState): boolean =>
  state.channel.enabled;

export const selectJoinLoading = (state: RootState): boolean =>
  !state.channel.enabled && state.channel.isLoading;

export const selectLeaveLoading = (state: RootState): boolean =>
  state.channel.enabled && state.channel.isLoading;
