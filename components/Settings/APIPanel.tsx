import { testKey as testKeyAzure } from "@/stores/AzureSDK";
import { update } from "@/stores/ChatActions";
import { useChatStore } from "@/stores/ChatStore";
import { testKey as testKey11Labs } from "@/stores/ElevenLabs";
import { testKey as testKeyOpenAI } from "@/stores/OpenAI";

import { useMantineTheme } from "@mantine/core";
import React from "react";

import { APIPanelBase } from "./APIPanelBase";
import { ApiPanelConfig } from "./APIPanelBase";
export function APIPanel({
  provider,
}: {
  provider: "openAi" | "azure" | "elevenLabs";
}) {
  const theme = useMantineTheme();

  const configs: Record<string, ApiPanelConfig> = {
    openAi: {
      initialKey: useChatStore((state) => state.apiKey),
      setKeyFun: (key: string) => update({ apiKey: key }),
      usage: ["chat", "STT"],
      descriptionBelowInput: (
        <>
          Get your API key from the {""}
          <a
            target="_blank"
            style={{ color: theme.colors.primary[5] }}
            href="https://platform.openai.com/account/api-keys"
          >
            OpenAI dashboard
          </a>
          .
        </>
      ),
      validateKey: testKeyOpenAI,
    },
    azure: {
      usage: ["TTS", "STT"],
      initialKey: useChatStore((state) => state.apiKey11Labs),
      initialRegion: useChatStore((state) => state.apiKeyAzureRegion),
      setKeyFun: (key: string) => update({ apiKeyAzure: key }),
      setKeyFunRegion: (region: string) =>
        update({ apiKeyAzureRegion: region }),
      descriptionBelowInput: (
        <>
          Follow{" "}
          <a
            target="_blank"
            style={{ color: theme.colors.primary[6] }}
            href="https://carldesouza.com/get-a-microsoft-cognitive-services-subscription-key/"
          >
            this guide
          </a>{" "}
          to get $200 free credit on signup.
        </>
      ),
      validateKey: testKeyAzure,
    },
    elevenLabs: {
      usage: ["TTS"],
      initialKey: useChatStore((state) => state.apiKey11Labs),
      setKeyFun: (key: string) => update({ apiKey11Labs: key }),
      descriptionBelowInput: (
        <>
          Get your API key from your{" "}
          <a
            target="_blank"
            style={{ color: theme.colors.primary[6] }}
            href="https://beta.elevenlabs.io/speech-synthesis"
          >
            ElevenLabs profile
          </a>
          .
        </>
      ),
      validateKey: testKey11Labs,
    },
  };

  return <APIPanelBase config={configs[provider]} />;
}
