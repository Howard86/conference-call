import React, { ChangeEvent, FC, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  InputGroup,
  InputLeftElement,
  Input,
  Icon,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { FaUserCircle, FaKey } from 'react-icons/fa';
import { RootState, useAppDispatch } from '@/redux/store';
import { login, logout } from '@/redux/user';

const LoginModal: FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast({
    position: 'bottom',
    duration: 3000,
    isClosable: true,
  });

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const handleOnClick = () => {
    if (isLoggedIn) {
      dispatch(logout());
    } else {
      onOpen();
    }
  };

  const handleOnEnter = () => {
    dispatch(login(password)).then((action) => {
      const success = action.payload;
      if (success) {
        onClose();
        toast({
          title: 'Success!',
          status: 'success',
        });
      } else {
        toast({
          title: 'Invalid Code',
          status: 'warning',
        });
      }
    });
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setUsername(event.target.value);

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);
  return (
    <>
      <Button onClick={handleOnClick}>
        {isLoggedIn ? 'Log Out' : 'Log In'}
      </Button>

      <Modal
        size="xs"
        motionPreset="slideInBottom"
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start a chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaUserCircle} />
                </InputLeftElement>
                <Input
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Enter your display name"
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaKey} />
                </InputLeftElement>
                <Input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter invite code"
                />
              </InputGroup>
            </VStack>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <Button colorScheme="blue" onClick={handleOnEnter}>
              Enter
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginModal;
