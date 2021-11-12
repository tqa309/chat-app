import React from "react";
import { HStack, VStack, Button, Heading, Text } from "@chakra-ui/react";
import firebase, { auth, db } from "../firebase/config";
import { addDocument } from "../firebase/services";
import { AiFillGoogleCircle } from 'react-icons/ai';
import { BsFacebook } from 'react-icons/bs';
import {IoChatbubbles } from 'react-icons/io5'
import Head from 'next/head';

const fbProvider = new firebase.auth.FacebookAuthProvider();
const ggProvider = new firebase.auth.GoogleAuthProvider();

const Login = () => {
  const handleLogin = async (provider) => {
    try {
      const { additionalUserInfo, user } =
        provider === "facebook"
          ? await auth.signInWithPopup(fbProvider)
          : await auth.signInWithPopup(ggProvider);

      if (additionalUserInfo?.isNewUser) {
        addDocument("users", {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          providerId: additionalUserInfo.providerId,
          isOnline: true,
        });
      } else {
        const usersRef = db.collection("users");
        usersRef
          .where("uid", "==", user.uid)
          .get()
          .then((snap) => {
            usersRef.doc(snap.docs[0].id).update({ isOnline: true });
          });
      }
    } catch (error) {}
  };

  const handleFbLogin = () => {
    handleLogin("facebook");
  };

  const handleGgLogin = () => {
    handleLogin("google");
  };

  return (
    <>
      
      <Head>
        <title>Log in to Mezz</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <HStack justifyContent="center" pt={10}>
        <VStack w={300} spacing={5}>
          <IoChatbubbles fontSize={60}/>
          <Heading pt={4} pb={3} fontWeight={300} size="lg">Log in to Mezz</Heading>
          <Button
            w="full"
            backgroundColor="red.500"
            color="white"
            rounded="full"
            h="60px"
            onClick={handleGgLogin}
          >
            <AiFillGoogleCircle fontSize={35}/>
            <Text ml={5}>Login with Google</Text>
          </Button>
          <Button
            w="full"
            backgroundColor="blue.500"
            color="white"
            rounded="full"
            h="60px"
            onClick={handleGgLogin}
          >
            <BsFacebook fontSize={30}/>
            <Text ml={5}>Login with Facebook</Text>
          </Button>
        </VStack>
      </HStack>
    </>
  );
};

export default Login;
