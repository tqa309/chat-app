import { Flex, HStack } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import Navigation from "../components/Navigation";
import Chat from "../components/Chat";
import ChatHistorySidebar from "../components/ChatHistory/ChatHistorySidebar";
import ChatFiles from "../components/ChatFiles";
import ChatHistoryDrawer from "../components/ChatHistory/ChatHistoryDrawer";
import ChatFilesDrawer from "../components/ChatFiles/ChatFilesDrawer";
import { cloneElement } from "react";
import Head from 'next/head';

type Props = {
  children?: any;
  title: string
};

const Main = ({ children, title }: Props) => {
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
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
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
        {cloneElement(children, {
          onChatHistoryOpen: onChatHistoryOpen,
          onChatFilesOpen: onChatFilesOpen,
        })}
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
      <ChatFilesDrawer isOpen={isChatFilesOpen} onClose={onChatFilesClose} />
    </HStack>
  );
};

export default Main;
