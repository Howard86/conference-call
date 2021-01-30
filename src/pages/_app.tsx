import React, { FC } from 'react';
import type { AppProps } from 'next/app';
import ProviderWrapper from '@/components/ProviderWrapper';
import store from '@/redux/store';

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <ProviderWrapper store={store} session={pageProps.session}>
    <Component {...pageProps} />
  </ProviderWrapper>
);

export default App;
