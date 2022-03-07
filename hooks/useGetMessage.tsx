import { useEffect, useState } from "react";
import { db } from "../firebase/config";

const useGetMessage = (
  selectedRoomId,
  indexLastLiveMessage = null,
  oldest = null,
  limit = 15
) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [oldestMessage, setOldestMessage] = useState(null);


  useEffect(() => {
    let collectionRef 

    if (indexLastLiveMessage) {
      collectionRef = db
      .collection("messages")
      .orderBy("createdAt")
      .startAt(indexLastLiveMessage)
      .where("roomId", "==", selectedRoomId);
    } else {
      collectionRef = db
      .collection("messages")
      .orderBy("createdAt", "desc")
      .limit(15)
      .where("roomId", "==", selectedRoomId);
    }

    const unsubscribe = collectionRef.onSnapshot((snapshot) => {
      const documents = snapshot.docs.map((doc) => {
        return doc;
      });

      if (indexLastLiveMessage) {
        setDocuments(prev => {
          const last = documents.length - 1;
          if (documents[last]?.id != prev[0].id && prev.length >= 15) {
            return [documents[last], ...prev]
          }
          return prev
        });

      } else {
        setDocuments(documents);
      }
    });

    return unsubscribe;
  }, [indexLastLiveMessage, selectedRoomId]);

  useEffect(() => {
    console.log('oldest')
    setLoading(true);
    let collectionRef = db.collection("messages").orderBy("createdAt", "desc");

    if (oldest) {
      collectionRef = collectionRef.startAfter(oldest);
    } else if (oldestMessage) {
      collectionRef = collectionRef.startAfter(oldestMessage);
    } else {
      setLoading(false);
      return;
    }

    collectionRef = collectionRef.limit(limit);

    if (selectedRoomId) {
      collectionRef = collectionRef.where("roomId", "==", selectedRoomId);
    }

    const unsubscribe = collectionRef.onSnapshot((snapshot) => {
      const documents = snapshot.docs.map((doc, index) => {
        if (index === snapshot.docs.length - 1) {
          setOldestMessage(doc);
        }
        return doc;
      });

      setLoading(false);
      setHasMore(documents.length === limit);
      setDocuments((prevDocs) => [...prevDocs, ...documents]);
    });

    return unsubscribe;
  }, [oldest]);

  return {
    documents,
    loading,
    hasMore,
    oldestMessage,
  };
};

export default useGetMessage;
