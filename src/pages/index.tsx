import React, { FC } from 'react';
import Head from 'next/head';
import { Button, Container, Heading, HStack, VStack } from '@chakra-ui/react';
import VideoBox from '@/components/VideoBox';

const Home: FC = () => {
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
            <Button>Join</Button>
            <Button>Leave</Button>
          </HStack>
        </VStack>
      </Container>
    </div>
  );
};

export default Home;
