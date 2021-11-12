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
import { Text } from "@chakra-ui/react";
import useSendMessage from "../../hooks/useSendMessage";
import ChatBubble from "./ChatBubble";
import { AuthContext } from "../../context/AuthProvider";
import OldSection from "./OldSection";

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

  const selectedRoomId = useMemo(
    () => selectedRoom.id,
    [selectedRoom.id]
  );

  const [indexLastLiveMessage, setIndexLastLiveMessage] = useState(null);

  const liveMessages = useSendMessage(
    "messages",
    selectedRoomId,
    indexLastLiveMessage
  );

  const finalLiveMessages = finalMessageDisplay(liveMessages);

  useEffect(() => {
    if (messageListRef?.current) {
      messageListRef.current.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    setFirstCallBack(false);
    setIndexLastLiveMessage(null);
  }, [selectedRoom.id]);

  const observer = useRef<IntersectionObserver>();
  const lastLiveMessagelementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        const length = liveMessages.length;
        if (entries[0].isIntersecting && length === 15) {
          setInputTrigger(false);
          setFirstCallBack(true);
          setIndexLastLiveMessage(liveMessages[length - 1]);
        }
      });
      if (node) observer.current.observe(node);
      if (firstCallBack && node) observer.current.unobserve(node);
    },
    [liveMessages]
  );

  return (
    <>
      {finalLiveMessages.map((mes, index) => {
        const from = mes.uid === auth.user.uid ? "me" : "others";
        const length = finalLiveMessages.length;
        const userPhotoURL = members.find(
          (user) => user.uid === mes.uid
        );
        const referrence =
          index === length - 1 ? lastLiveMessagelementRef : null;
        return (
          <ChatBubble
            key={mes.id}
            type="live"
            textArray={mes.textArray}
            photoURL={userPhotoURL?.photoURL}
            isOnline={userPhotoURL?.isOnline}
            displayName={mes.displayName}
            createdAt={mes.lastMessageTime}
            from={from}
            breakTime={mes.breakTime}
            referrence={referrence}
          />
        );
      })}
      {!finalLiveMessages.length && selectedRoom.id && (
        <Text textAlign="center" fontSize={13} color="#a7a7a7" mb={5}>
          Start the conversation
        </Text>
      )}
      {
        <OldSection
          inputTrigger={inputTrigger}
          indexLastLiveMessage={indexLastLiveMessage}
        />
      }
    </>
  );
}
