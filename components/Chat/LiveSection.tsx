import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RoomContext } from "../../context/RoomProvider";
import { finalMessageDisplay } from "../../firebase/services";
import { Spinner, VStack, Text } from "@chakra-ui/react";
import ChatBubble from "./ChatBubble";
import { AuthContext } from "../../context/AuthProvider";
import useGetMessage from "../../hooks/useGetMessage";

export default function LiveSection({
  messageListRef,
  setInputTrigger,
  inputTrigger,
  firstCallBack,
  setFirstCallBack,
}) {
  const {
    state: { selectedRoom },
    members
  } = useContext(RoomContext);
  const auth = useContext(AuthContext);
  
  useEffect(() => {
    if (messageListRef?.current) {
      messageListRef.current.scrollTop = 0;
    }
  }, []);

  const selectedRoomId = useMemo(
    () => selectedRoom.id,
    [selectedRoom.id]
  );

  const [indexLastLiveMessage, setIndexLastLiveMessage] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);

  useEffect(() => {
    if (!lastDoc) {
      setLastDoc(indexLastLiveMessage);
    }
  }, [indexLastLiveMessage]);

  const { documents, hasMore, loading, oldestMessage } = useGetMessage(
    selectedRoomId,
    indexLastLiveMessage,
    lastDoc
  );

  console.log('rerender')

  useEffect(() => {
    setFirstCallBack(false);
  }, [selectedRoom.id]);

  const observer = useRef<IntersectionObserver>();
  const lastLiveMessagelementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        const length = documents.length;
        if (entries[0].isIntersecting && length === 15) {
          setInputTrigger(false);
          setFirstCallBack(true);
          setIndexLastLiveMessage(documents[length - 1]);
        }
      });
      if (node) observer.current.observe(node);
      if (firstCallBack && node) observer.current.unobserve(node);
    },
    [documents]
  );
  

  const observerOld = useRef<IntersectionObserver>();
  const lastOldMessagelementRef = useCallback(
    (node) => {
      if (observerOld.current) observerOld.current.disconnect();
      observerOld.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLastDoc(oldestMessage);
        }
      });
      if (node) observerOld.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    if (!inputTrigger) {
      setLastDoc(oldestMessage);
    }
  }, [observerOld.current, inputTrigger]);

  const finalLiveMessages = finalMessageDisplay(documents)

  return (
    <>
      {finalLiveMessages.map((mes, index) => {
        
        const from = mes.uid === auth.user.uid ? "me" : "others";
        const length = finalLiveMessages.length;
        const userPhotoURL = members.find(
          (user) => user.uid === mes.uid
        );
        const liveReferrence =
          (mes.isLastLiveMessage) ? lastLiveMessagelementRef : null;
        const oldReferrence =
          (mes.isLastOldMessage) ? lastOldMessagelementRef : null;
        return (
          <ChatBubble
            key={mes.id}
            textArray={mes.textArray}
            photoURL={userPhotoURL?.photoURL}
            isOnline={userPhotoURL?.isOnline}
            displayName={mes.displayName}
            createdAt={mes.lastMessageTime}
            from={from}
            breakTime={mes.breakTime}
            referrence={liveReferrence || oldReferrence}
          />
        );
      })}
      {!finalLiveMessages.length && selectedRoom.id && (
        <Text textAlign="center" fontSize={13} color="#a7a7a7" mb={5}>
          Start the conversation
        </Text>
      )}
      {loading && <VStack position="relative" >
          <VStack position="absolute" style={{top: -12}}>
          <Spinner />
          </VStack>
        </VStack>}
    </>
  );
}
