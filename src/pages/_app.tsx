import React, { FC } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as NextAuthProvider } from 'next-auth/client';
import type { AppProps } from 'next/app';
import store from '@/redux/store';

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <ReduxProvider store={store}>
    <NextAuthProvider session={pageProps.session}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </NextAuthProvider>
  </ReduxProvider>
);

export default App;
