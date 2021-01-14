import React, { FC } from 'react';
import { signIn, useSession } from 'next-auth/client';
import { Button, Text } from '@chakra-ui/react';
import { updateAccessToken } from '@/redux/channel';
import useToast from '@/hooks/use-toast';
import { useAppDispatch } from '@/redux/store';
import type { SerializedError } from '@reduxjs/toolkit';

const AdminSession: FC = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [session] = useSession();

  const handleSignIn = () => signIn('github');

  const handleUpdate = async () => {
    const action = await dispatch(updateAccessToken());
    const success = updateAccessToken.fulfilled.match(action);

    // TODO: fix type
    const error = action.payload as SerializedError;

    toast({
      title: success ? 'Successfully update token' : 'Something went wrong',
      description: !success && error.name,
      status: success ? 'success' : 'error',
    });
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
