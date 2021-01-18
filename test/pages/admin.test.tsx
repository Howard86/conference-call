import React from 'react';
import AdminPage from '@/pages/admin';
import { render } from '../test-utils';
jest.mock('next/dynamic', () => () =>
  function TestComponent() {
    return <div>Test</div>;
  },
);

describe('AdminPage', () => {
  it('should render Admin page', () => {
    render(<AdminPage />, {});
  });
});
