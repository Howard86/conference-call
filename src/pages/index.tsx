import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Heading, HStack, Text } from '@chakra-ui/react';

import LoginModal from '@/components/LoginModal';
import Layout from '@/components/Layout';
import ButtonRouterLink from '@/components/ButtonRouterLink';
import { selectUser } from '@/redux/user';

const HomePage: FC = () => {
  const { isLoggedIn, username } = useSelector(selectUser);

  return (
    <Layout title="Start a call">
      <Heading>{isLoggedIn ? `Hello ${username}` : 'Ready to join?'}</Heading>
      <Text>Fill in the invite code then start a conversation!</Text>
      <HStack justify="center">
        <LoginModal />
        {isLoggedIn && <ButtonRouterLink href="/call" text="Start" />}
      </HStack>
    </Layout>
  );
};

export default HomePage;
