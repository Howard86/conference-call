import type {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from 'agora-rtc-sdk-ng';
import { createAsyncThunk } from '@reduxjs/toolkit';
import config from '@/config';

type AgoraListener = (
  user: IAgoraRTCRemoteUser,
  mediaType: 'audio' | 'video',
) => void;

interface RTC {
  client: IAgoraRTCClient;
  localAudioTrack: ILocalAudioTrack;
  localVideoTrack: ILocalVideoTrack;
}

const CHANNEL_NAME = 'conference';

let remoteUsers = {};

const rtc: RTC = {
  client: null,
  localAudioTrack: null,
  localVideoTrack: null,
};

const options = {
  appid: config.agora.appId,
  token: config.agora.testToken,
  channel: CHANNEL_NAME,
  uid: null,
};

export const join = createAsyncThunk('channel/join', async () => {
  const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
  rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  // add event listener to play remote tracks when remote user publishes.
  rtc.client.on('user-published', handleUserPublished);
  rtc.client.on('user-unpublished', handleUserUnpublished);

  // join a channel and create local tracks, we can use Promise.all to run them concurrently
  [options.uid, rtc.localAudioTrack, rtc.localVideoTrack] = await Promise.all([
    // join the channel
    rtc.client.join(options.appid, options.channel, options.token),
    // create local tracks, using microphone and camera
    AgoraRTC.createMicrophoneAudioTrack(),
    AgoraRTC.createCameraVideoTrack(),
  ]);

  // play local video track
  rtc.localVideoTrack.play('local-player');

  // publish local tracks to channel
  await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
});

export const leave = createAsyncThunk('channel/leave', async () => {
  stop(rtc.localAudioTrack);
  stop(rtc.localVideoTrack);

  // remove remote users and player views
  remoteUsers = {};
  rtc.localAudioTrack = null;
  rtc.localVideoTrack = null;

  // leave the channel
  await rtc.client.leave();
});

const stop = (localTrack: ILocalVideoTrack | ILocalAudioTrack) => {
  localTrack.stop();
  localTrack.close();
};

const subscribe: AgoraListener = async (user, mediaType) => {
  // subscribe to a remote user
  await rtc.client.subscribe(user, mediaType);
  if (mediaType === 'video') {
    user.videoTrack.play('remote-player');
  }
  if (mediaType === 'audio') {
    user.audioTrack.play();
  }
};

const handleUserPublished: AgoraListener = (user, mediaType) => {
  const id = user.uid;
  remoteUsers[id] = user;
  subscribe(user, mediaType);
};

const handleUserUnpublished: AgoraListener = (user) => {
  const id = user.uid;
  delete remoteUsers[id];
};
