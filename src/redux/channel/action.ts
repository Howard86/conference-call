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

interface AgoraApp {
  AgoraRTC: IAgoraRTC;
  agoraClient: IAgoraRTCClient;
  localAudioTrack: ILocalAudioTrack;
  localVideoTrack: ILocalVideoTrack;
}

const app: AgoraApp = {
  AgoraRTC: null,
  agoraClient: null,
  localAudioTrack: null,
  localVideoTrack: null,
};

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
    app.AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
    app.agoraClient = app.AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    // ! Fixed initialization issues with React dynamic import
    const {
      addOnlineUser,
      removeOnlineUser,
      updateErrorMessage,
    } = await import('./slice');

    // ! EventHandlers will run twice, currently fixed by reducers
    app.agoraClient.on('user-published', async (agoraUser, mediaType) => {
      try {
        await app.agoraClient.subscribe(agoraUser, mediaType);
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

    app.agoraClient.on('user-unpublished', (agoraUser) => {
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
      [agoraUID, app.localAudioTrack, app.localVideoTrack] = await Promise.all([
        app.agoraClient.join(config.agora.appId, CHANNEL_NAME, token),
        app.AgoraRTC.createMicrophoneAudioTrack(),
        app.AgoraRTC.createCameraVideoTrack(),
      ]);
    } catch (error) {
      return rejectWithValue({
        name,
        message: error.message,
      });
    }

    app.localVideoTrack.play('local-player');

    try {
      await app.agoraClient.publish([app.localAudioTrack, app.localVideoTrack]);
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

const clear = (track: ILocalAudioTrack | ILocalVideoTrack) => {
  track.stop();
  track.close();
};
export const leave = createAsyncThunk(
  'channel/leave',
  async (_, { getState }) => {
    const root = getState() as RootState;
    const uid = `${root.user.uid}`;

    clear(app.localAudioTrack);
    app.localAudioTrack = null;
    clear(app.localVideoTrack);
    app.localVideoTrack = null;

    await deleteLocal(`users/${uid}`);
    await app.agoraClient.leave();
    return uid;
  },
);

export const updateVolume = async (isPublished: boolean): Promise<boolean> => {
  if (!app.localAudioTrack || !app.agoraClient) {
    return false;
  }

  // TODO: somehow the browser still detects accessing microphone after unpublish
  if (isPublished) {
    app.localAudioTrack.setVolume(0);
    await app.agoraClient.unpublish(app.localAudioTrack);
    clear(app.localAudioTrack);
  } else {
    app.localAudioTrack = await app.AgoraRTC.createMicrophoneAudioTrack();
    await app.agoraClient.publish(app.localAudioTrack);
  }

  return true;
};

export const updateVideoPublish = async (
  isPublished: boolean,
): Promise<boolean> => {
  if (!app.localVideoTrack || !app.agoraClient) {
    return false;
  }

  if (isPublished) {
    await app.agoraClient.unpublish(app.localVideoTrack);
    clear(app.localVideoTrack);
  } else {
    app.localVideoTrack = await app.AgoraRTC.createCameraVideoTrack();
    app.localVideoTrack.play('local-player');
    await app.agoraClient.publish(app.localVideoTrack);
  }

  return true;
};
