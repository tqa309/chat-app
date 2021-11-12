import {
  Flex,
  Heading,
  Box,
  Divider,
  Input,
  FormControl,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { db } from "../../firebase/config";
import { addDocument } from "../../firebase/services";

type Props = {
  action: "CREATE" | "JOIN";
  uid: string;
};

const RoomActionForm = ({ action, uid }: Props) => {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
    resetField,
    clearErrors
  } = useForm();

  const [
    isSuccessfullySubmitted,
    setIsSuccessfullySubmitted,
  ] = useState(false);

  const onSubmit = async (values) => {
    if (action === "CREATE") {
      const newRoom = await addDocument("rooms", {
        name: values.name,
        members: [uid],
        photoURL: null,
      });
      await db
        .collection("rooms")
        .doc(newRoom.id)
        .update({
          code: newRoom.id.slice(0, 8),
        });
      resetField("name");
      setIsSuccessfullySubmitted(true);
      return new Promise((resolve) => {
        resolve("");
        setTimeout(() => {
          setIsSuccessfullySubmitted(false);
        }, 3000)
      });
    }

    if (action === "JOIN") {
      const snap = await db
        .collection("rooms")
        .where("code", "==", values.code)
        .get();

      if (snap.docs.length > 0) {
        const room = snap.docs[0];
        const members = room.data().members;
        if (members.includes(uid)) {
          setError("code", {
            message: "Already in room!",
          });
        }
        else {
          await room.ref.update({
            members: [...members, uid],
          });
          resetField("code");
          setIsSuccessfullySubmitted(true)
          return new Promise((resolve) => {
            resolve("");
            setTimeout(() => {
              setIsSuccessfullySubmitted(false);
            }, 3000)
          });
        }
      } else {
        setError("code", {
          message: "Room not found!",
        });
      }
    }
  };

  const registerName = action === "CREATE" ? "name" : "code";
  const heading = action === "CREATE" ? "Create room" : "Join a room with code";
  const placeholder = action === "CREATE" ? "Room name" : "Enter the code";
  const buttonText = action === "CREATE" ? "Create" : "Join";
  const error =
    action === "CREATE"
      ? errors.name && errors.name.message
      : errors.code && errors.code.message;

  return (
    <>
      <Box px={8} w="full">
        <Heading size="xs" w="full">
          {heading}
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex>
            <FormControl>
              <Input
                onBlur={() => {clearErrors()}}
                {...register(registerName, {
                  required: "This is required",
                })}
                variant="filled"
                mt={2}
                minH={10}
                rounded="full"
                placeholder={placeholder}
              />
            </FormControl>
            <Button ml={2} mt={2} type="submit">
              {buttonText}
            </Button>
          </Flex>
        </form>
        <Heading size="xs" mt={2} color="red.400">
          {!isSuccessfullySubmitted && error}
        </Heading>
        {isSuccessfullySubmitted && (
          <Heading size="xs" mt={2} color="green.400">
            {buttonText} successfully!
          </Heading>
        )}
      </Box>
      <Box px={8} w="full">
        <Divider color="gray.100" />
      </Box>
    </>
  );
};

export default RoomActionForm;
