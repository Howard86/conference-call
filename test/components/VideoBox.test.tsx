import React from 'react';
import VideoBox from '@/components/VideoBox';
import { render } from '../test-utils';

describe('VideoBox', () => {
  it('should render VideoBox Component', () => {
    render(<VideoBox />, {});
  });
});
