import { Flex, Box, VStack, Heading, Text } from '@chakra-ui/react'
import UserAvatar from '../UserAvatar'

type Props = {
  name: string;
  lastMessage: {
    text: string;
    time: string;
  };
}

const ChatRow = ({name, lastMessage}: Props) => {
  return (
    <Flex
      py={4}
      px={8}
      w="full"
      alignItems="center"
      borderBottomColor="gray.100"
      borderBottomWidth={1}
      style={{ transition: "background 300ms" }}
      _hover={{ bg: "gray.50", cursor: "pointer" }}
    >
      <UserAvatar name={name} photoURL="" isOnline={false}/>
      <VStack
        overflow="hidden"
        flex={1}
        ml={3}
        spacing={0}
        alignItems="flex-start"
      >
        <Heading fontSize={12} w="full">
          {name}
        </Heading>
        <Text
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          w="full"
          fontSize="xs"
          color="gray.500"
        >
          {lastMessage.text}
        </Text>
      </VStack>
      <Text ml={3} fontSize="xs" color="gray.500">
        {lastMessage.time}
      </Text>
    </Flex>
  )
}

export default ChatRow

