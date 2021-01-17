import { RtcRole, RtcTokenBuilder } from 'agora-access-token';
import config from 'config';

const UID = 0; // allow access of any user
const EXPIRED_TIME_IN_SECS = 3600;

const channelTokens: Record<string, string> = {};

export const getToken = (channelName: string): string | undefined =>
  channelTokens[channelName];

export const updateToken = (channelName: string): string => {
  const currentTimestamp = Math.floor(Date.now() / 1000);

  channelTokens[channelName] = RtcTokenBuilder.buildTokenWithUid(
    config.agora.appId,
    config.agora.certificate,
    channelName,
    UID,
    RtcRole.PUBLISHER,
    currentTimestamp + EXPIRED_TIME_IN_SECS,
  );

  return channelTokens[channelName];
};
