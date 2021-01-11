import React from 'react';
import LoginModal from '@/components/LoginModal';
import { render } from '../test-utils';

describe('LoginModal', () => {
  it('should render LoginModal Component', () => {
    render(<LoginModal />, {});
  });
});
