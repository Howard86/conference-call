import React, { FC } from 'react';
import { signIn, useSession } from 'next-auth/client';
import { Button, Text } from '@chakra-ui/react';

const AdminSession: FC = () => {
  const [session] = useSession();

  const handleSignIn = () => signIn('github');

  return session ? (
    <>
      <Text>Signed in as {session.user.email}</Text>
      <Button>Update Token</Button>
    </>
  ) : (
    <Button onClick={handleSignIn}>Sign In</Button>
  );
};

export default AdminSession;
