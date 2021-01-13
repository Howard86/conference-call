import React from 'react';
import AdminSession from '@/components/AdminSession';
import { render } from '../test-utils';

describe('AdminSession', () => {
  it('should render AdminSession Component', () => {
    render(<AdminSession />, {});
  });
});
