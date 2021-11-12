import { Spinner, VStack } from "@chakra-ui/react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RoomContext } from "../../context/RoomProvider";
import { AuthContext } from "../../context/AuthProvider";
import { finalMessageDisplay } from "../../firebase/services";
import useLoadOldMessage from "../../hooks/useLoadOldMessage";
import ChatBubble from "./ChatBubble";

export default function OldSection({
  indexLastLiveMessage,
  inputTrigger,
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

  const [lastDoc, setLastDoc] = useState(null);

  useEffect(() => {
    if (!lastDoc) {
      setLastDoc(indexLastLiveMessage);
    }
  }, [indexLastLiveMessage]);

  const { documents, hasMore, loading, lastDocMessage } = useLoadOldMessage(
    "messages",
    selectedRoomId,
    lastDoc
  );

  useEffect(() => {
    if (!lastDoc) {
      setLastDoc(lastDocMessage);
    }
  }, [lastDocMessage]);

  const finalMessages = finalMessageDisplay(documents);

  const observer = useRef<IntersectionObserver>();
  const lastMessagelementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLastDoc(lastDocMessage);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    if (!inputTrigger) {
      setLastDoc(lastDocMessage);
    }
  }, [observer.current, inputTrigger]);

  return (
    <>
      {finalMessages.length
        ? finalMessages.map((mes, index) => {
            const from = mes.uid === auth.user.uid ? "me" : "others";
            const userPhotoURL = members.filter(user => user.uid === mes.uid)
            
            const referrence = (index === finalMessages.length - 1) ? lastMessagelementRef : null;
            return (
              <></>
            );
          })
        : <></>}

      {loading && <VStack position="relative" >
          <VStack position="absolute" style={{top: -12}}>
          <Spinner />
          </VStack>
        </VStack>}
    </>
  );
}
