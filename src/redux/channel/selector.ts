import type { RootState } from '@/redux/store';

export const selectJoined = (state: RootState): boolean =>
  state.channel.enabled;
