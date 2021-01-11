import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  IAgoraRTC,
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
  UID,
} from 'agora-rtc-sdk-ng';
import type { RootState } from '@/redux/store';
import type { User } from '@/server/user-service';
import config from '@/config';
import { GetUserByUIDResponse, getLocal, deleteLocal, postLocal } from '../api';

let AgoraRTC: IAgoraRTC;
let agoraClient: IAgoraRTCClient;
let localAudioTrack: ILocalAudioTrack;
let localVideoTrack: ILocalVideoTrack;

const CHANNEL_NAME = 'conference';

export const activate = createAsyncThunk(
  'channel/activate',
  async (_, { dispatch }) => {
    AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
    agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    // ! Fixed initialization issues with React dynamic import
    const { addOnlineUser, removeOnlineUser } = await import('./slice');

    // ! EventHandlers will run twice, currently fixed by reducers
    agoraClient.on('user-published', async (agoraUser, mediaType) => {
      await agoraClient.subscribe(agoraUser, mediaType);

      switch (mediaType) {
        case 'video':
          agoraUser.videoTrack.play('remote-player');
          break;

        case 'audio':
          agoraUser.audioTrack.play();
          break;

        default:
          console.error(`Unknown mediaType ${mediaType}`);
          break;
      }

      const { success, user } = await getLocal<GetUserByUIDResponse>(
        `users/${agoraUser.uid}`,
      );

      if (success) {
        dispatch(addOnlineUser(user));
      }
    });

    agoraClient.on('user-unpublished', (agoraUser) => {
      agoraUser.audioTrack?.removeAllListeners();
      agoraUser.videoTrack?.removeAllListeners();
      dispatch(removeOnlineUser(`${agoraUser.uid}`));
    });
  },
);

export const join = createAsyncThunk(
  'channel/join',
  async (username: string) => {
    let agoraUID: UID;

    [agoraUID, localAudioTrack, localVideoTrack] = await Promise.all([
      agoraClient.join(
        config.agora.appId,
        CHANNEL_NAME,
        config.agora.testToken,
      ),
      AgoraRTC.createMicrophoneAudioTrack(),
      AgoraRTC.createCameraVideoTrack(),
    ]);

    localVideoTrack.play('local-player');

    await agoraClient.publish([localAudioTrack, localVideoTrack]);

    const uid = `${agoraUID}`;
    const user: User = {
      username,
      uid,
      // ! this may have timezone issues, should be handled by server
      createdAt: Date.now().valueOf(),
    };

    postLocal('users', user);
    return user;
  },
);

export const leave = createAsyncThunk(
  'channel/leave',
  async (_, { getState }) => {
    const root = getState() as RootState;
    const uid = `${root.user.uid}`;

    localAudioTrack.stop();
    localAudioTrack.close();
    localAudioTrack = undefined;

    localVideoTrack.stop();
    localVideoTrack.close();
    localVideoTrack = undefined;

    deleteLocal(`users/${uid}`);
    await agoraClient.leave();
    return uid;
  },
);
