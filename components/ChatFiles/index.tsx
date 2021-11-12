import {
  Flex,
  HStack,
  Text,
  IconButton,
  Box,
  VStack,
  Heading,
  Button,
  Divider,
  List,
  ListItem,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { useContext } from "react";
import { RoomContext } from "../../context/RoomProvider";
import { IoSettingsSharp } from "react-icons/io5";
import UserAvatar from "../UserAvatar";
import ChatFile from "./ChatFile";
import ChatLink from "./ChatLink";

const ChatFiles = () => {
  const room = useContext(RoomContext);

  return (
    <Flex h="full" flexDirection="column" alignItems="center" w="full" pt={8}>
      <HStack justify="space-between" w="full" px={8} mb={8}>
        <Text color="gray.500">20 March 2021</Text>
        <IconButton
          rounded="full"
          icon={<IoSettingsSharp />}
          color="gray.500"
          variant="ghost"
          aria-label="Notifications"
        />
      </HStack>
      {room.state.selectedRoom.id && (
        <>
          <HStack
            overflowX="auto"
            minH={24}
            px={8}
            w="full"
            justifyContent="flex-start"
            spacing={3}
          >
            {room.members.map((mem) => (
              <UserAvatar
                key={mem.id}
                name={mem.displayName}
                photoURL={mem.photoURL}
                isOnline={mem.isOnline}
              />
            ))}
          </HStack>
          <Box px={8} w="full">
            <Divider mt={6} color="gray.100" />
          </Box>
          <VStack spacing={6} overflowY="auto" w="full">
            <HStack px={8} w="full" mt={6} justifyContent="space-between">
              <Heading size="md">Shared files</Heading>
              <Button fontWeight="normal" variant="text">
                See all
              </Button>
            </HStack>
            <List spacing={4} mt={6} w="full">
              <ListItem>
                <ChatFile />
              </ListItem>
              <ListItem>
                <ChatFile />
              </ListItem>
              <ListItem>
                <ChatFile />
              </ListItem>
              <ListItem>
                <ChatFile />
              </ListItem>
            </List>
          </VStack>
          <Box px={8} w="full">
            <Divider mt={6} color="gray.100" />
          </Box>
          <VStack spacing={6} overflowY="auto" w="full">
            <HStack px={8} w="full" mt={6} justifyContent="space-between">
              <Heading size="md">Shared links</Heading>
              <Button fontWeight="normal" variant="text">
                See all
              </Button>
            </HStack>
            <List spacing={4} mt={6} w="full">
              <ListItem>
                <ChatLink />
              </ListItem>
              <ListItem>
                <ChatLink />
              </ListItem>
              <ListItem>
                <ChatLink />
              </ListItem>
              <ListItem>
                <ChatLink />
              </ListItem>
            </List>
          </VStack>
        </>
      )}
    </Flex>
  );
};

export default ChatFiles;
