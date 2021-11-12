import { useContext, useEffect, useState } from "react";
import { db } from "../firebase/config";

const useLoadOldMessage = (
  collection = "",
  selectedRoomId,
  lastDoc = null,
  limit = 15
) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDocMessage, setLastDocMessage] = useState(null);

  useEffect(() => {
    setHasMore(true);
    setLastDocMessage(null)
    setDocuments([])
  }, [selectedRoomId])

  useEffect(() => {
    setLoading(true)
    let collectionRef = db.collection(collection).orderBy("createdAt", "desc");

    if (lastDoc) {
      collectionRef = collectionRef.startAfter(lastDoc);
    } else if (lastDocMessage) {
      collectionRef = collectionRef.startAfter(lastDocMessage);
    } else {
      setLoading(false)
      return;
    }

    collectionRef = collectionRef.limit(limit);

    if (selectedRoomId) {
      collectionRef = collectionRef.where(
        "roomId",
        "==",
        selectedRoomId
      );
    }

    const unsubscribe = collectionRef.onSnapshot((snapshot) => {
      const documents = snapshot.docs.map((doc, index) => {
        if (index === snapshot.docs.length - 1) {
          setLastDocMessage(doc);
        }
        return {
          ...doc.data(),
          id: doc.id,
        };
      });

      setLoading(false);
      setHasMore(documents.length === limit);
      setDocuments((prevDocs) => [...prevDocs, ...documents]);
    });

    return unsubscribe;
  }, [lastDoc]);

  return {
    documents,
    loading,
    hasMore,
    lastDocMessage,
  };
};

export default useLoadOldMessage;
