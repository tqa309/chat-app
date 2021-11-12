import {
  Flex,
  HStack,
  Heading,
  VStack,
  Text,
  StatNumber,
  IconButton,
} from "@chakra-ui/react";
import { BiMenu } from "react-icons/bi";
import { HiChat } from "react-icons/hi";

import ChatBubble from "./ChatBubble";
import OldSection from "./OldSection";
import { useContext, useEffect, useRef, useState } from "react";
import { RoomContext } from "../../context/RoomProvider";
import InputForm from "./InputForm";
import LiveSection from "./LiveSection";

type Props = {
  onChatHistoryOpen: () => void;
  onChatFilesOpen: () => void;
};

const Chat = ({ onChatHistoryOpen, onChatFilesOpen }: Props) => {
  const app = useContext(RoomContext);

  const messageListRef = useRef(null);
  const [inputTrigger, setInputTrigger] = useState(false);
  const [firstCallBack, setFirstCallBack] = useState(false);

  useEffect(() => {
    if (messageListRef?.current) {
      messageListRef.current.scrollTop = 0;
    }
  }, [app.state.selectedRoom]);

  return (
    <Flex w="full" flexDirection="column">
      <HStack px={4} py={4} borderBottomColor="gray.100" borderBottomWidth={1}>
        <IconButton
          onClick={onChatHistoryOpen}
          display={{ base: "inherit", lg: "none" }}
          icon={<HiChat />}
          aria-label="Toggle Chat History Drawer"
        />
          
          <VStack w="full" alignItems="flex-start">
            <Text fontSize={14}>Chatting in</Text>
            <Heading style={{marginTop: -3}} size="lg">{app.state.selectedRoom.name}</Heading>
          </VStack>

        <IconButton
          onClick={onChatFilesOpen}
          display={{ base: "inherit", lg: "none" }}
          icon={<BiMenu />}
          aria-label="Toggle Chat Files Drawer"
        />
      </HStack>
      <Flex
        px={6}
        overflowY="auto"
        flexDirection="column-reverse"
        flex={1}
        ref={messageListRef}
        position="relative"
        pt={6}
      >
        <LiveSection
          firstCallBack={firstCallBack}
          setFirstCallBack={setFirstCallBack}
          messageListRef={messageListRef}
          setInputTrigger={setInputTrigger}
          inputTrigger={inputTrigger}
        />
      </Flex>
      <InputForm
        setFirstCallBack={setFirstCallBack}
        setInputTrigger={setInputTrigger}
        messageListRef={messageListRef}
      />
    </Flex>
  );
};

export default Chat;
