import React from 'react';
import CallPage from '@/pages/call';
import { render } from '../test-utils';

describe('CallPage', () => {
  it('should render Call page', () => {
    render(<CallPage />, {});
  });
});
