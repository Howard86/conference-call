import React from 'react';
import ButtonRouterLink from '@/components/ButtonRouterLink';
import { render } from '../test-utils';

describe('ButtonRouterLink', () => {
  it('should render ButtonRouterLink Component', () => {
    render(<ButtonRouterLink href="/" text="test" />, {});
  });
});
