import React, { FC } from 'react';
import { signIn, useSession } from 'next-auth/client';
import { Button, Text } from '@chakra-ui/react';
import useToast from '@/hooks/use-toast';
import { useAppDispatch } from '@/redux/store';
import { updateAccessToken } from '@/redux/channel';

const AdminSession: FC = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [session] = useSession();

  const handleSignIn = () => signIn('github');

  const handleUpdate = () => {
    dispatch(updateAccessToken())
      .then(() =>
        toast({ title: 'Successfully update token', status: 'success' }),
      )
      .catch((err) =>
        toast({
          title: 'Something went wrong',
          description: err.message,
          status: 'error',
        }),
      );
  };

  return session ? (
    <>
      <Text>Signed in as {session.user.email}</Text>
      <Button onClick={handleUpdate}>Update Token</Button>
    </>
  ) : (
    <Button onClick={handleSignIn}>Sign In</Button>
  );
};

export default AdminSession;
