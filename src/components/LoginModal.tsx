import React, { ChangeEvent, FC, useState } from 'react';
import { useRouter } from 'next/router';
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
  useDisclosure,
} from '@chakra-ui/react';
import { FaUserCircle, FaKey } from 'react-icons/fa';

import useToast from '@/hooks/use-toast';
import { useAppDispatch } from '@/redux/store';
import { login, updateUsername } from '@/redux/user';
import { activate } from '@/redux/channel';

const LoginModal: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleOnEnter = async () => {
    const action = await dispatch(login(password));
    if (action.payload) {
      toast({
        title: 'Successfully Enter!',
        status: 'success',
      });
      onClose();
      dispatch(updateUsername(username));
      await dispatch(activate());
      router.push('/call');
    } else {
      toast({
        title: 'Invalid Code',
        status: 'warning',
      });
    }
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setUsername(event.target.value);

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);
  return (
    <>
      <Button onClick={onOpen}>Log In</Button>

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
