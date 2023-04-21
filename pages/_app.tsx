import { AppProps } from "next/app";
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

import { Tuple, DefaultMantineColor } from "@mantine/core";

type ExtendedCustomColors =
  | "primaryColorName"
  | "secondaryColorName"
  | DefaultMantineColor;

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

  const colorTheme = [
    colorScheme === "light" ? "#f2f2f2" : "#0d0d0d",
    colorScheme === "light" ? "#d9d9d9" : "#262626",
    colorScheme === "light" ? "#bfbfbf" : "#404040",
    colorScheme === "light" ? "#a6a6a6" : "#595959",
    colorScheme === "light" ? "#8c8c8c" : "737373",
    colorScheme === "light" ? "#737373" : "#8c8c8c",
    colorScheme === "light" ? "#595959" : "#a6a6a6",
    colorScheme === "light" ? "#404040" : "#000000",
    colorScheme === "light" ? "#262626" : "#000000",
    colorScheme === "light" ? "#0d0d0d" : "#000000",
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
              // https://smart-swatch.netlify.app/#5E6AD2
              primary: colorTheme,
              dark: colorTheme,
            },
            primaryColor: "primary",
          }}
        >
          <Notifications />
          <AppShell
            padding={0}
            navbar={<Nav />}
            layout="alt"
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            styles={(theme) => ({
              main: {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              },
            })}
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
