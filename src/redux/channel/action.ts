import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  IAgoraRTC,
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
  UID,
} from 'agora-rtc-sdk-ng';
import type { RootState } from '@/redux/store';
import type { User } from '@/server/user';
import config from '@/config';
import {
  GetUserByUIDResponse,
  IssueTokenResponse,
  getLocal,
  deleteLocal,
  postLocal,
} from '../api';

let AgoraRTC: IAgoraRTC;
let agoraClient: IAgoraRTCClient;
let localAudioTrack: ILocalAudioTrack;
let localVideoTrack: ILocalVideoTrack;

const CHANNEL_NAME = 'conference';

export const updateAccessToken = createAsyncThunk(
  'channel/update_token',
  async (_, { rejectWithValue }) => {
    const { success, token } = await postLocal<IssueTokenResponse>('issue', {});

    if (!success) {
      return rejectWithValue({ message: 'Unauthorized action' });
    }

    return token;
  },
);

export const activate = createAsyncThunk(
  'channel/activate',
  async (_, { dispatch }) => {
    AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
    agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    // ! Fixed initialization issues with React dynamic import
    const {
      addOnlineUser,
      removeOnlineUser,
      updateErrorMessage,
    } = await import('./slice');

    // ! EventHandlers will run twice, currently fixed by reducers
    agoraClient.on('user-published', async (agoraUser, mediaType) => {
      try {
        await agoraClient.subscribe(agoraUser, mediaType);
      } catch (error) {
        dispatch(updateErrorMessage(error.message));
      }

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
  async (username: string, { rejectWithValue }) => {
    let agoraUID: UID;

    const name = 'Please contact admin';
    const { token, success } = await getLocal<IssueTokenResponse>('issue');

    if (!success) {
      return rejectWithValue({ name, message: 'token expired' });
    }

    try {
      [agoraUID, localAudioTrack, localVideoTrack] = await Promise.all([
        agoraClient.join(config.agora.appId, CHANNEL_NAME, token),
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(),
      ]);
    } catch (error) {
      return rejectWithValue({
        name,
        message: error.message,
      });
    }

    localVideoTrack.play('local-player');

    try {
      await agoraClient.publish([localAudioTrack, localVideoTrack]);
    } catch (error) {
      return rejectWithValue({
        name,
        message: error.message,
      });
    }

    const uid = `${agoraUID}`;
    const user: User = {
      username,
      uid,
      // ! this may have timezone issues, should be handled by server
      createdAt: Date.now().valueOf(),
    };

    await postLocal('users', user);
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

    await deleteLocal(`users/${uid}`);
    await agoraClient.leave();
    return uid;
  },
);

export const updateVolume = async (isPublished: boolean): Promise<boolean> => {
  if (!localAudioTrack || !agoraClient) {
    return false;
  }

  // TODO: somehow the browser still detects accessing microphone after unpublish
  if (isPublished) {
    localAudioTrack.setVolume(0);
    await agoraClient.unpublish(localAudioTrack);
  } else {
    localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await agoraClient.publish(localAudioTrack);
  }

  return true;
};

export const updateVideoPublish = async (
  isPublished: boolean,
): Promise<boolean> => {
  if (!localVideoTrack || !agoraClient) {
    return false;
  }

  if (isPublished) {
    await agoraClient.unpublish(localVideoTrack);
    localVideoTrack.stop();
    localVideoTrack.close();
  } else {
    localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    localVideoTrack.play('local-player');
    await agoraClient.publish(localVideoTrack);
  }

  return true;
};
