import React from 'react';
import CallPage from '@/pages/call';
import { render } from '../test-utils';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: (endpoint: string) => {
        console.error(endpoint);
      },
    };
  },
}));

describe('CallPage', () => {
  it('should render Call page', () => {
    render(<CallPage />, {});
  });
});
