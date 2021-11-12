import { VStack, Box, Text, HStack } from "@chakra-ui/react";
import { formatDate } from "../../firebase/services";
import UserAvatar from "../UserAvatar";

type Props = {
  referrence: any;
  textArray: any;
  from: string;
  photoURL: any;
  displayName: any;
  createdAt: any;
  breakTime: any;
  isOnline: boolean;
};

const ChatBubble = ({
  referrence,
  textArray,
  from,
  photoURL,
  displayName,
  createdAt,
  breakTime,
  isOnline,
}: Props) => {
  const isMe = from === "me";
  const bottomRightRadius = isMe ? 0 : 32;
  const bottomLeftRadius = isMe ? 32 : 0;
  const alignment = isMe ? "flex-end" : "flex-start";

  const FakeAvatar = () => <div style={{width: 48, height: 48}}></div>;

  return (
    <>
      {textArray.map((textItem, index) => {
        const length = textArray.length;
        const hasAvatar = index === 0;
        let mesReferrence = null;
        let displayBreakTime = null
        if (index === length - 1) {
          displayBreakTime = breakTime?.seconds
          mesReferrence = referrence;
        }
        return (
          <>
          <HStack mt={4} alignItems={alignment} alignSelf={alignment}>
            {
              !isMe && hasAvatar && <UserAvatar name={displayName} photoURL={photoURL} isOnline={isOnline} />
            }
            {
              !isMe && !hasAvatar && <FakeAvatar />
            }
            <Box
              ref={referrence}
              bg={isMe ? "blue.50" : "gray.100"}
              px={6}
              py={4}
              maxW={80}
              borderTopLeftRadius={32}
              borderTopRightRadius={32}
              borderBottomRightRadius={bottomRightRadius}
              borderBottomLeftRadius={bottomLeftRadius}
            >
              {textItem.text}
            </Box>
          </HStack>
          {
            displayBreakTime && <Text fontSize="12px" my={4} textAlign="center">{formatDate(displayBreakTime)}</Text>
          }
          </>
        );
      })}
    </>
  );
};

export default ChatBubble;
