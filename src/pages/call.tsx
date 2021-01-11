import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Button, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import VideoBox from '@/components/VideoBox';
import Layout from '@/components/Layout';

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

const CallPage: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const toast = useToast();

  const { isLoggedIn, username } = useSelector(selectUser);
  const joined = useSelector(selectJoined);
  const loadingJoin = useSelector(selectJoinLoading);
  const loadingLeave = useSelector(selectLeaveLoading);

  const handleJoin = () => {
    dispatch(join(username));
  };

  const handleLeave = () => {
    dispatch(leave());
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
    </Layout>
  );
};

export default CallPage;
