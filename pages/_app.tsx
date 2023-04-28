import { AppProps, NextWebVitalsMetric } from "next/app";
import Head from "next/head";
import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  Flex,
  MantineProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "highlight.js/styles/stackoverflow-dark.css";

import { useChatStore } from "@/stores/ChatStore";

import Nav from "@/components/Nav/Nav";
import { lazy, useEffect, useState } from "react";
import ChatInputCluster from "@/components/InputCluster/InputCluster";
import { setColorScheme } from "@/stores/ChatActions";

const ElevenLabsPlayer = lazy(() => import("@/components/ElevenLabsPlayer"));
const AzurePlayer = lazy(() => import("@/components/AzurePlayer"));

if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  require("../mocks");
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric);
}

import { Tuple, DefaultMantineColor } from "@mantine/core";

type ExtendedCustomColors = "primary" | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const colorScheme = useChatStore((state) => state.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
  };

  const apiKey = useChatStore((state) => state.apiKey);
  const playerMode = useChatStore((state) => state.playerMode);
  const modelChoiceTTS = useChatStore((state) => state.modelChoiceTTS);

  const [isHydrated, setIsHydrated] = useState(false);

  //Wait till NextJS rehydration completes
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  const AudioPlayer =
    modelChoiceTTS === "azure" ? AzurePlayer : ElevenLabsPlayer;

  const dark = [
    "#E3E3E3",
    "#BEBEBE",
    "#8C8C8C",
    "#535353",
    "#262626",
    "#222222",
    "#1E1E1E",
    "#141414",
    "#101010",
    "#0A0A0A",
  ];

  const light = [
    "#f2f2f2",
    "#EBEBEB",
    "#d9d9d9",
    "#bfbfbf",
    "#a6a6a6",
    "#8c8c8c",
    "#737373",
    "#595959",
    "#404040",
    "#262626",
    "#0d0d0d",
  ];

  const dynamic = [
    colorScheme === "light" ? light[0] : dark[6], // 0
    colorScheme === "light" ? light[1] : dark[4], // 1
    colorScheme === "light" ? light[2] : dark[2], // 2
    colorScheme === "light" ? light[3] : dark[3], // 3
    colorScheme === "light" ? light[4] : dark[3], // 4
    colorScheme === "light" ? light[5] : dark[2], // 5
    colorScheme === "light" ? light[6] : dark[2], // 6
    colorScheme === "light" ? light[7] : dark[7], // 7
    colorScheme === "light" ? light[8] : dark[1], // 8
    colorScheme === "light" ? light[9] : dark[0], // 9
  ];

  return (
    <>
      <Head>
        <title>YakGPT</title>
        <meta name="description" content="A new ChatGPT UI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme,
            colors: {
              primary: dynamic,
              light: light,
              dark: dark,
            },
            spacing: {
              xxxs: "0.21875rem",
              xxs: "0.5625rem",
              xs: "0.625rem",
              sm: "0.75rem",
              md: "1rem",
              lg: "1.25rem",
              xl: "1.5rem",
              xxl: "2rem",
            },
            primaryColor: "primary",
          }}
        >
          <Notifications />
          <AppShell
            padding={0}
            navbar={<Nav />}
            //layout="alt"
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
          >
            <Flex direction={"column"} h={"100vh"} justify="space-between">
              {
                //<MuHeader />
              }

              <Component {...pageProps} />

              {apiKey && <ChatInputCluster />}
            </Flex>

            {playerMode && <AudioPlayer />}
          </AppShell>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
