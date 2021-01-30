import React, { FC } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as NextAuthProvider, Session } from 'next-auth/client';
import type { EnhancedStore } from '@reduxjs/toolkit';

interface ProviderWrapperProps {
  store: EnhancedStore;
  session: Session;
}

const ProviderWrapper: FC<ProviderWrapperProps> = ({
  children,
  session,
  store,
}) => (
  <ReduxProvider store={store}>
    <NextAuthProvider session={session}>
      <ChakraProvider>{children}</ChakraProvider>
    </NextAuthProvider>
  </ReduxProvider>
);

export default ProviderWrapper;
