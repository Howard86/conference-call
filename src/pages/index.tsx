import React, { FC } from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { Button, Container, Heading, HStack, VStack } from '@chakra-ui/react';
import VideoBox from '@/components/VideoBox';
import { useAppDispatch } from '@/redux/store';
import { join, leave } from '@/redux/channel/action';
import {
  selectJoinLoading,
  selectLeaveLoading,
  selectJoined,
} from '@/redux/channel/selector';

const Home: FC = () => {
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
    <div>
      <Head>
        <title>HomePage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container as="main" centerContent>
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
        </VStack>
      </Container>
    </div>
  );
};

export default Home;
