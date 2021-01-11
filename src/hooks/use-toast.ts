import { useToast as useChakraToast, UseToastOptions } from '@chakra-ui/react';

const useToast = (
  options?: UseToastOptions,
): ReturnType<typeof useChakraToast> =>
  useChakraToast({
    position: 'bottom',
    duration: 3000,
    isClosable: true,
    ...options,
  });

export default useToast;
