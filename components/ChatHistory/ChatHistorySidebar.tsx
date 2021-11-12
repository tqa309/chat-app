import {
  VStack,
  Flex,
  Heading,
  HStack,
  Box,
  Divider,
  Text,
  Input,
  List,
  ListItem,
  FormControl,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { addDocument } from "../../firebase/services";
import useFireStore from "../../hooks/useFireStore";
import UserMainAvatar from "../UserMainAvatar";
import ChatRow from "./ChatRow";
import UserAvatar from "../UserAvatar";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { RoomContext } from "../../context/RoomProvider";
import { db } from "../../firebase/config";
import RoomActionForm from "./RoomActionForm";

const onlineFriends = [
  "Lazar Nikolov",
  "Mark Chandler",
  "Segun Adebayo",
  "Folassade Agbeje",
];

const ChatHistorySidebar = () => {
  const auth = useContext(AuthContext);
  const roomCtx = useContext(RoomContext);

  const roomsCondition = useMemo(
    () => ({
      fieldName: "members",
      operator: "array-contains",
      compareValue: auth.user.uid,
    }),
    [auth.user.uid]
  );

  const rooms = useFireStore("rooms", roomsCondition);

  const [firstCallBack, setfirstCallBack] = useState(true)

  useEffect(() => {
    if (rooms[0]?.id && firstCallBack) {
      handleSelectRoom(rooms[0].id)
      setfirstCallBack(false)
    }
  }, [rooms])

  const handleSelectRoom = async (rid) => {
    const roomDoc = await db.collection("rooms").doc(rid).get();
    const room = roomDoc.data();

    roomCtx.setState({
      selectedRoom: {
        id: rid,
        name: room.name,
        members: room.members,
      },
    });
  };

  return (
    <VStack h="full" alignItems="center" w="full" spacing={6}>
      <Flex
        w="full"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
      >
        <UserMainAvatar
          uid={auth.user.uid}
          name={auth.user.displayName}
          photoURL={auth.user.photoURL}
          isOnline={auth.user.isOnline}
        />
      </Flex>
      <Box px={8} w="full">
        <Divider color="gray.100" />
      </Box>
      <RoomActionForm action="CREATE" uid={auth.user.uid}/>
      <RoomActionForm action="JOIN" uid={auth.user.uid}/>

      <Box px={8} w="full">
        <HStack w="full" justifyContent="space-between">
          <Heading size="xs">Rooms</Heading>
          <Text fontSize="sm" color="gray.500" fontWeight="semibold">
            {rooms.length}
          </Text>
        </HStack>
        <Input
          variant="filled"
          mt={2}
          minH={10}
          rounded="full"
          placeholder="Search"
        />
      </Box>
      <Box w="full" overflow="auto">
        <List w="full" spacing={0}>
          {rooms.map((r) => (
            <ListItem
              key={r.id}
              onClick={() => {
                handleSelectRoom(r.id);
              }}
            >
              <ChatRow
                name={r.name}
                lastMessage={{ text: "hello", time: "08:30" }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </VStack>
  );
};

export default ChatHistorySidebar;
