import firebase, { db } from "./config";
import { formatRelative } from "date-fns";

export const addDocument = async (collection: string, data: object) => {
  const query = db.collection(collection);

  const timeStamp = new Date();

  const result = await query.add({
    ...data,
    createdAt: timeStamp,
  });

  return result;
};

export const finalMessageDisplay = (firstArray) => {
  let mesArray = [...firstArray];

    mesArray = mesArray.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

  let length = mesArray.length;

  const result = [];
  let textArray = [];

  for (let i = 0; i < length; i++) {
    const { text, createdAt, ...finalMessage } = mesArray[i];
    textArray.push({ text, createdAt });

    /**
     * Neu cung mot user va khong cach nhau
     * qua 10 phut thi gom lai thanh mot doan
     * tin nhan
     */
    while (
      mesArray[i + 1]?.uid === mesArray[i].uid &&
      mesArray[i].createdAt.seconds - mesArray[i + 1]?.createdAt.seconds <= 60
    ) {
      const { text, createdAt } = mesArray[i + 1];
      textArray.push({ text, createdAt });
      i++;
    }

    /**
     * Neu khoang cach giua 2 tin nhan qua
     * 10 phut thi tach ra. breakTime bang
     * thoi gian cua tin moi hon
     */
    if (
      mesArray[i].createdAt.seconds - mesArray[i + 1]?.createdAt.seconds >
      60
    ) {
      finalMessage.breakTime = mesArray[i].createdAt;
    }

    if (i === length - 1) {
      finalMessage.breakTime = mesArray[i].createdAt;
      if (length === 15) {
        finalMessage.isLastLiveMessage = true;
      } else {
        finalMessage.isLastOldMessage = true;
      }
    }

    finalMessage.textArray = textArray;

    result.push(finalMessage);
    textArray = [];
  }

  return result;
};


export function formatDate(seconds) {
  let formattedDate = "";

  if (seconds) {
      formattedDate = formatRelative(new Date(seconds * 1000), new Date());

      formattedDate =
          formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

      if (formattedDate.includes('Today at')) {
          formattedDate = formattedDate.slice(8)
      }
  }

  return formattedDate;
}
