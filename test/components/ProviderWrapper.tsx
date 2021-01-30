import React, { FC } from 'react';
import ProviderWrapper from '@/components/ProviderWrapper';
import store from '@/redux/store';
import { render, screen } from '../test-utils';

describe('ProviderWrapper', () => {
  const Test: FC = () => <div data-testid="test">Test</div>;

  it('should render ProviderWrapper Component', () => {
    render(
      <ProviderWrapper store={store} session={null}>
        <Test />
      </ProviderWrapper>,
    );

    expect(screen.queryByTestId('test')).toBeInTheDocument();
  });
});
