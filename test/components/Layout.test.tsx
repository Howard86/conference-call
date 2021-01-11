import React, { FC } from 'react';
import Layout from '@/components/Layout';
import { render, screen } from '../test-utils';

describe('Layout', () => {
  const Test: FC = () => <div data-testid="test">Test</div>;

  it('should render Layout Component', () => {
    render(
      <Layout title="test-title">
        <Test />
      </Layout>,
    );

    expect(screen.queryByTestId('test')).toBeInTheDocument();
  });
});
