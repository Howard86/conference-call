import React, { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import {
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
} from '@chakra-ui/react';
import type { SerializedError } from '@reduxjs/toolkit';
import VideoBox from '@/components/VideoBox';
import Layout from '@/components/Layout';
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';
import { IoVideocamOutline, IoVideocamOffOutline } from 'react-icons/io5';

import useToast from '@/hooks/use-toast';
import {
  selectJoined,
  selectJoinLoading,
  selectLeaveLoading,
  leave,
  join,
} from '@/redux/channel';
import { useAppDispatch } from '@/redux/store';
import { selectUser } from '@/redux/user';
import { updateVideoPublish, updateVolume } from '@/redux/channel/action';
import { VStack } from '@chakra-ui/react';

const CallPage: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const toast = useToast();

  const { isLoggedIn, username } = useSelector(selectUser);
  const joined = useSelector(selectJoined);
  const loadingJoin = useSelector(selectJoinLoading);
  const loadingLeave = useSelector(selectLeaveLoading);

  const [isListened, setListened] = useState(false);
  const [isListenedLoading, setListenedLoading] = useState(false);
  const [isPublished, setPublished] = useState(true);
  const [isPublishedLoading, setPublishedLoading] = useState(false);

  const handleJoin = async () => {
    const action = await dispatch(join(username));
    const success = join.fulfilled.match(action);

    // TODO: fix type
    const error = action.payload as SerializedError;

    toast({
      title: success ? 'Successfully join a room' : error.name,
      status: success ? 'success' : 'error',
      description: !success && error.message,
    });
  };

  const handleLeave = async () => {
    const action = await dispatch(leave());

    const success = leave.fulfilled.match(action);

    // TODO: fix type
    const error = action.payload as SerializedError;

    toast({
      title: success ? 'Successfully leave a room' : error.name,
      status: success ? 'success' : 'error',
      description: !success && error.message,
    });
  };

  const handleOnMute = () => {
    setListenedLoading(true);
    updateVolume(isListened)
      .then((success) => {
        if (success) {
          setListened(!isListened);
        } else {
          toast({
            status: 'error',
            title: 'Failed to adjust volume',
          });
        }
      })
      .finally(() => setListenedLoading(false));
  };

  const handleOnVideoPublish = () => {
    setPublishedLoading(true);
    updateVideoPublish(isPublished)
      .then((success) => {
        if (success) {
          setPublished(!isPublished);
        } else {
          toast({
            status: 'error',
            title: 'Failed to stop screening',
          });
        }
      })
      .finally(() => setPublishedLoading(false));
  };

  useEffect(() => {
    if (!isLoggedIn) {
      toast({ title: 'Redirecting...', status: 'info' });
      router.push('/');
    }
  }, [isLoggedIn]);

  return !isLoggedIn ? (
    <Layout title="Please log in first">
      <Heading>Unauthorized Access</Heading>
      <Text>Please log in first</Text>
    </Layout>
  ) : (
    <Layout title="Find a room">
      <Heading>Video Call</Heading>
      <Flex
        direction={['column', 'column', 'row']}
        justify="space-evenly"
        align="center"
        w="full"
      >
        <VideoBox id="local-player" />
        <VideoBox id="remote-player" />
      </Flex>
      <VStack>
        <HStack>
          <Button
            isDisabled={loadingJoin || joined}
            isLoading={loadingJoin}
            onClick={handleJoin}
          >
            Join
          </Button>
          <Button
            isDisabled={loadingLeave || !joined}
            isLoading={loadingLeave}
            onClick={handleLeave}
          >
            Leave
          </Button>
        </HStack>
        <HStack>
          <IconButton
            colorScheme="blue"
            variant="ghost"
            aria-label={isListened ? 'unmute microphone' : 'mute microphone'}
            icon={isListened ? <BiMicrophoneOff /> : <BiMicrophone />}
            fontSize="xl"
            isLoading={isListenedLoading}
            disabled={isPublishedLoading || !joined}
            onClick={handleOnMute}
          />
          <IconButton
            colorScheme="blue"
            variant="ghost"
            aria-label={isPublished ? 'activate webcam' : 'deactivate webcam'}
            icon={
              isPublished ? <IoVideocamOutline /> : <IoVideocamOffOutline />
            }
            fontSize="2xl"
            isLoading={isPublishedLoading}
            disabled={isPublishedLoading || !joined}
            onClick={handleOnVideoPublish}
          />
        </HStack>
      </VStack>
    </Layout>
  );
};

export default CallPage;
