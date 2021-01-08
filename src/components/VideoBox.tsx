import React, { FC } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

const VideoBox: FC<BoxProps> = (props) => (
  <Box {...props} bg="blackAlpha.50" w="300px" h="300px" borderRadius="lg" />
);

export default VideoBox;
