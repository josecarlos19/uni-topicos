import React from "react";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <SessionProvider session={session}>
    <ConfigProvider>
      <Head>
        <title>Estoque Mestre</title>
      </Head>
      <Component {...pageProps} />
    </ConfigProvider>
  </SessionProvider>
);

export default App;
