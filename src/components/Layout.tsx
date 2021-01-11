import React, { FC } from 'react';
import Head from 'next/head';
import { Container, VStack } from '@chakra-ui/react';

interface LayoutProps {
  title: string;
}

const Layout: FC<LayoutProps> = ({ children, title }) => (
  <div>
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Container as="main" my={[8, 12, 20]} minH="80vh" centerContent>
      <VStack spacing={[4, 8, 12]} w="full">
        {children}
      </VStack>
    </Container>
  </div>
);

export default Layout;
