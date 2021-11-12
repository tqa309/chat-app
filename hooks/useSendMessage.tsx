import { useEffect, useState } from "react";
import { db } from "../firebase/config";

const useSendMessage = (
  collection,
  selectedRoomId,
  indexLastLiveMessage = null,
  lastDoc = null,
  limit = 15
) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    let collectionRef = db
      .collection(collection)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .where("roomId", "==", selectedRoomId);

    const unsubscribe = collectionRef.onSnapshot((snapshot) => {
      const documents = snapshot.docs.map((doc) => {
        return doc;
      });

      setDocuments(documents);
    });

    return unsubscribe;
  }, [selectedRoomId]);

  useEffect(() => {
    let collectionRef = db
      .collection(collection)
      .orderBy("createdAt")
      .startAt(indexLastLiveMessage)
      .limit(limit)
      .where("roomId", "==", selectedRoomId);

    const unsubscribe = collectionRef.onSnapshot((snapshot) => {
      const documents = snapshot.docs.map((doc) => {
        return doc;
      });

      documents.reverse();
      setDocuments(documents);
    });

    return unsubscribe;
  }, [indexLastLiveMessage]);

  return documents;
};

export default useSendMessage;
