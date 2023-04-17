import { AppProps, NextWebVitalsMetric } from "next/app";
import Head from "next/head";
import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "highlight.js/styles/stackoverflow-dark.css";

import { useChatStore } from "@/stores/ChatStore";

import Nav from "@/components/Nav";
import { useEffect, useState } from "react";
import UIController from "@/components/UIController";
import { setColorScheme } from "@/stores/ChatActions";
import ElevenLabsPlayer from "@/components/ElevenLabsPlayer";
import AzurePlayer from "@/components/AzurePlayer";

if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  require("../mocks");
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric);
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
            primaryColor: "bluu",
            colors: {
              // https://smart-swatch.netlify.app/#5E6AD2
              bluu: [
                "#e8edff",
                "#c2c8f3",
                "#9aa3e5",
                "#727ed9",
                "#4c59cd",
                "#3240b3",
                "#26318d",
                "#1a2366",
                "#0e1540",
                "#04061b",
              ],
            },
            spacing: {
              xxxs: "0.21875rem",
              xxs: "0.5625rem",
              xs: "0.625rem",
              sm: "0.75rem",
              md: "1rem",
              lg: "1.25rem",
              xl: "1.5rem",
            },
          }}
        >
          <Notifications />
          <AppShell
            padding={0}
            navbar={<Nav />}
            layout="alt"
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
          >
            <div style={{ position: "relative", height: "100%" }}>
              <Component {...pageProps} />

              {apiKey && <UIController />}
            </div>
            {playerMode && <AudioPlayer />}
          </AppShell>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
