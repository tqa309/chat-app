import { Flex, Input, IconButton, FormControl } from "@chakra-ui/react";
import { IoSend } from "react-icons/io5";

import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { RoomContext } from "../../context/RoomProvider";
import { addDocument, finalMessageDisplay } from "../../firebase/services";
import { useForm } from "react-hook-form";

export default function InputForm({
  messageListRef,
  setInputTrigger,
  setFirstCallBack,
}) {
  const app = useContext(RoomContext);
  const auth = useContext(AuthContext);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    resetField,
    setFocus,
  } = useForm();

  const inputRef = useRef(null);

  const onSubmit = (values) => {
    const newMessage = {
      text: values.message,
      uid: auth.user.uid,
      roomId: app.state.selectedRoom.id,
    };

    resetField("message");
    setFocus("message");
    addDocument("messages", newMessage);

    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }

    if (messageListRef?.current) {
      messageListRef.current.scrollTop = 0;
    }

    setInputTrigger(true);
    setFirstCallBack(false);
  };

  return (
    <>
      {app.state.selectedRoom.id && (
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 24 }}>
          <Flex
            pl={4}
            pr={2}
            py={2}
            borderTopColor="gray.100"
            borderTopWidth={1}
          >
            <FormControl>
              <Input
                {...register("message", {
                  required: true,
                })}
                variant="unstyled"
                placeholder="Type your message"
              />
            </FormControl>
            <p>{errors.message && errors.message.message}</p>
            <IconButton
              type="submit"
              colorSchema="blue"
              aria-label="Send message"
              variant="ghost"
              icon={<IoSend />}
            />
          </Flex>
        </form>
      )}
    </>
  );
}
