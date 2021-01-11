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

  const [isMute, setMute] = useState(false);
  const [isPublished, setPublished] = useState(true);

  const handleJoin = () => {
    dispatch(join(username));
  };

  const handleLeave = () => {
    dispatch(leave());
  };

  const handleOnMute = () => {
    const success = updateVolume(isMute ? 100 : 0);
    if (success) {
      setMute(!isMute);
    } else {
      toast({
        status: 'error',
        title: 'Failed to adjust volume',
      });
    }
  };

  const handleOnVideoPublish = () => {
    updateVideoPublish(isPublished).then((success) => {
      if (success) {
        setPublished(!isPublished);
      } else {
        toast({
          status: 'error',
          title: 'Failed to stop screening',
        });
      }
    });
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
            isDisabled={joined}
            isLoading={loadingJoin}
            onClick={handleJoin}
          >
            Join
          </Button>
          <Button
            isDisabled={!joined}
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
            aria-label={isMute ? 'unmute microphone' : 'mute microphone'}
            icon={isMute ? <BiMicrophoneOff /> : <BiMicrophone />}
            fontSize="xl"
            disabled={!joined}
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
            disabled={!joined}
            onClick={handleOnVideoPublish}
          />
        </HStack>
      </VStack>
    </Layout>
  );
};

export default CallPage;
