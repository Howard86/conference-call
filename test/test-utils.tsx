import React, { FC, ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import ProviderWrapper from '@/components/ProviderWrapper';
import store from '@/redux/store';

const WrappedProviders: FC = ({ children }) => (
  <ProviderWrapper store={store} session={null}>
    {children}
  </ProviderWrapper>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult => render(ui, { wrapper: WrappedProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
