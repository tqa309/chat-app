import { Flex, HStack } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import Navigation from "./Navigation";
import Chat from "./Chat";
import ChatHistorySidebar from "./ChatHistory/ChatHistorySidebar";
import ChatFiles from "./ChatFiles";
import ChatHistoryDrawer from "./ChatHistory/ChatHistoryDrawer";
import ChatFilesDrawer from "./ChatFiles/ChatFilesDrawer";

const ChatRoom = () => {
  const {
    isOpen: isChatHistoryOpen,
    onOpen: onChatHistoryOpen,
    onClose: onChatHistoryClose,
  } = useDisclosure();

  const {
    isOpen: isChatFilesOpen,
    onOpen: onChatFilesOpen,
    onClose: onChatFilesClose,
  } = useDisclosure();

  return (
    <HStack h="100vh" spacing={0}>
      <Flex as="nav" h="full" maxW={16} w="full" bg="gray.100">
        <Navigation />
      </Flex>
      <Flex
        as="nav"
        h="full"
        maxW={{ base: "xs", xl: "sm" }}
        display={{ base: "none", lg: "flex" }}
        w="full"
        borderRightColor="gray.100"
        borderRightWidth={1}
        pt={8}
      >
        <ChatHistorySidebar />
      </Flex>
      <Flex
        as="nav"
        h="full"
        flex={1}
        w="full"
        borderRightColor="gray.100"
        borderRightWidth={1}
      >
        <Chat onChatHistoryOpen={onChatHistoryOpen} onChatFilesOpen={onChatFilesOpen} />
      </Flex>
      <Flex
        maxW={{ base: "xs", xl: "sm" }}
        display={{ base: "none", lg: "flex" }}
        as="nav"
        h="full"
        w="full"
      >
        <ChatFiles />
      </Flex>

      <ChatHistoryDrawer
        isOpen={isChatHistoryOpen}
        onClose={onChatHistoryClose}
      />
      <ChatFilesDrawer
        isOpen={isChatFilesOpen}
        onClose={onChatFilesClose}
      />
    </HStack>
  );
};

export default ChatRoom;
