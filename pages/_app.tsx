import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import AuthProvider from "../context/AuthProvider";
import RoomProvider from "../context/RoomProvider";
import Head from 'next/head'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.jpg"/>
      </Head>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
    </AuthProvider>
  );
};

export default App;
