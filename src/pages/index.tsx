import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Button, Heading, HStack, VStack } from '@chakra-ui/react';
import VideoBox from '@/components/VideoBox';
import { useAppDispatch } from '@/redux/store';
import {
  join,
  leave,
  selectJoinLoading,
  selectLeaveLoading,
  selectJoined,
} from '@/redux/channel';
import LoginModal from '@/components/LoginModal';
import Layout from '@/components/Layout';

const HomePage: FC = () => {
  const dispatch = useAppDispatch();
  const joined = useSelector(selectJoined);
  const loadingJoin = useSelector(selectJoinLoading);
  const loadingLeave = useSelector(selectLeaveLoading);

  const handleJoin = () => {
    dispatch(join());
  };

  const handleLeave = () => {
    dispatch(leave());
  };

  return (
    <Layout title="Start a call">
      <VStack spacing={10}>
        <Heading>Video Call</Heading>
        <HStack spacing={4}>
          <VideoBox id="local-player" />
          <VideoBox id="remote-player" />
        </HStack>
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
        <LoginModal />
      </VStack>
    </Layout>
  );
};

export default HomePage;
