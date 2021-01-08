import React, { FC, ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';

const WrappedProviders: FC = ({ children }) => (
  <ChakraProvider>{children}</ChakraProvider>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult => render(ui, { wrapper: WrappedProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
