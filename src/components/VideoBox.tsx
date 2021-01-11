import React, { FC } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

const VideoBox: FC<BoxProps> = (props) => (
  <Box
    bg="blackAlpha.50"
    w="240px"
    h="240px"
    my={[4, 8]}
    borderRadius="lg"
    shadow="md"
    {...props}
  />
);

export default VideoBox;
