import { useState } from "react";
import {
  Button,
  Group,
  Box,
  Loader,
  Tabs,
  px,
  PasswordInput,
  TextInput,
  Title,
  Flex,
  Badge,
  useMantineTheme,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { testKey as testKeyOpenAI } from "@/stores/OpenAI";
import { testKey as testKey11Labs } from "@/stores/ElevenLabs";
import { testKey as testKeyAzure } from "@/stores/AzureSDK";

import { useChatStore } from "@/stores/ChatStore";
import {
  IconAlertSquare,
  IconAlertSquareRounded,
  IconBrandOpenai,
  IconBrandWindows,
  IconChartBubble,
  IconCheck,
  IconLink,
  IconMessage,
  IconMicrophone,
  IconRobot,
  IconSpeakerphone,
  IconVolume,
  IconX,
} from "@tabler/icons-react";
import { update } from "@/stores/ChatActions";

type Usage = "TTS" | "STT" | "chat";

export function APIPanel({
  name,
  initialKey,
  initialRegion,
  setKeyFun,
  setKeyFunRegion,
  descriptionAboveInput,
  descriptionBelowInput,
  usage,
  validateKey,
  closeModal,
}: {
  name: string;
  initialKey: string | undefined;
  initialRegion?: string | undefined;
  setKeyFun: (key: string) => void;
  setKeyFunRegion?: (key: string) => void;
  descriptionAboveInput: string;
  descriptionBelowInput: React.ReactNode;
  usage: Usage[];
  validateKey: (key: string, region?: string) => Promise<boolean>;
  closeModal: () => void;
}) {
  const [checkStatus, setCheckStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [apiKey, setApiKey] = useState(initialKey);
  const [region, setRegion] = useState(initialRegion);

  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckStatus("idle");
    setApiKey(event.target.value);
  };

  const theme = useMantineTheme();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (apiKey) {
      setCheckStatus("loading");

      const keyValid = await validateKey(apiKey, region);

      if (keyValid) {
        notifications.show({
          message: "Key saved!",
          color: "green",
        });
        setKeyFun(apiKey);
        if (setKeyFunRegion && region) {
          setKeyFunRegion(region);
        }
        setCheckStatus("success");
      } else {
        notifications.show({
          message: "Something went wrong",
          color: "red",
        });
        setCheckStatus("error");
      }
    }
  };

  const iconMap = {
    idle: null,
    loading: <Loader size={px("1rem")} />,
    success: <IconCheck color="green" size={px("1rem")} />,
    error: <IconX color="red" size={px("1rem")} />,
  };
  const icon = iconMap[checkStatus];
  console.log(apiKey);

  const usageMap = {
    STT: { icon: IconMicrophone, description: "Speech-to-text" },
    TTS: { icon: IconVolume, description: "Text-to-speech" },
    chat: { icon: IconMessage, description: "Chat" },
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction={"row"} gap={"sm"}>
        {usage.map((u) => {
          const Icon = usageMap[u].icon;
          return (
            <Badge
              size="md"
              p="sm"
              variant="filled"
              color="gray.6"
              leftSection={
                <Box pt={4}>
                  <Icon size={15} stroke={1.6} />
                </Box>
              }
            >
              {usageMap[u].description}
            </Badge>
          );
        })}
      </Flex>
      <PasswordInput
        label={
          <>
            API Key{" "}
            <a href="">
              <IconLink size={15} style={{ width: "auto", height: "auto" }} />
            </a>
          </>
        }
        placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        icon={icon}
        value={apiKey}
        onChange={handleKeyChange}
      />
      {setKeyFunRegion && (
        <TextInput
          label="Region"
          placeholder="westus"
          value={region}
          onChange={(event) => setRegion(event.target.value)}
        />
      )}
      {descriptionBelowInput}
      <Flex align={"center"} gap={"xs"}>
        <IconAlertSquareRounded
          size={55}
          style={{ margin: 0, padding: 0, width: "auto", height: "auto" }}
          stroke={0.9}
        />
        <Text size={"xs"}>
          Your API keys are stored locally and are not sent to any third-party
          or intermediate servers.
        </Text>
        <Button
          type="submit"
          disabled={initialKey === apiKey && initialRegion === region}
        >
          Save
        </Button>
      </Flex>
    </form>
  );
}

export default function KeyModal({ close }: { close: () => void }) {
  const apiKeyOpenAI = useChatStore((state) => state.apiKey);
  const apiKey11Labs = useChatStore((state) => state.apiKey11Labs);
  const apiKeyAzure = useChatStore((state) => state.apiKeyAzure);
  const apiKeyAzureRegion = useChatStore((state) => state.apiKeyAzureRegion);

  const setApiKeyOpenAI = (key: string) => update({ apiKey: key });
  const setApiKeyAzure = (key: string) => update({ apiKeyAzure: key });
  const setApiKeyAzureRegion = (region: string) =>
    update({ apiKeyAzureRegion: region });
  const setApiKey11Labs = (key: string) => update({ apiKey11Labs: key });

  return (
    <Box mx="auto">
      <Tabs defaultValue="openai" variant="pills" color={"gray.8"}>
        <Tabs.List grow>
          <Tabs.Tab
            value="openai"
            icon={<IconBrandOpenai stroke={1.1} size={px("0.8rem")} />}
          >
            OpenAI
          </Tabs.Tab>
          <Tabs.Tab
            value="azure"
            icon={<IconBrandWindows stroke={1.1} size={px("0.8rem")} />}
          >
            Azure
          </Tabs.Tab>
          <Tabs.Tab
            value="11labs"
            icon={<IconSpeakerphone stroke={1.1} size={px("0.8rem")} />}
          >
            Eleven Labs
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="openai" pt="xs">
          <APIPanel
            name="Enter Your OpenAI API Key"
            initialKey={apiKeyOpenAI}
            setKeyFun={setApiKeyOpenAI}
            usage={["chat", "STT"]}
            descriptionBelowInput={
              <p>
                → Get your API key from the{" "}
                <a
                  target="_blank"
                  href="https://platform.openai.com/account/api-keys"
                >
                  OpenAI dashboard
                </a>
                .
              </p>
            }
            validateKey={testKeyOpenAI}
            closeModal={close}
          />
        </Tabs.Panel>
        <Tabs.Panel value="azure" pt="xs">
          <APIPanel
            name="Enter Your Azure Speech API Key"
            usage={["TTS", "STT"]}
            initialKey={apiKeyAzure}
            initialRegion={apiKeyAzureRegion}
            setKeyFun={setApiKeyAzure}
            setKeyFunRegion={setApiKeyAzureRegion}
            descriptionBelowInput={
              <p>
                → Azure gives a $200 free credit on signup.{" "}
                <a
                  target="_blank"
                  href="https://carldesouza.com/get-a-microsoft-cognitive-services-subscription-key/"
                >
                  This guide explains the steps.
                </a>
              </p>
            }
            validateKey={testKeyAzure}
            closeModal={close}
          />
        </Tabs.Panel>
        <Tabs.Panel value="11labs" pt="xs">
          <APIPanel
            name="Enter Your Eleven Labs API Key"
            usage={["TTS"]}
            initialKey={apiKey11Labs}
            setKeyFun={setApiKey11Labs}
            descriptionBelowInput={
              <p>
                → Get your API key from your{" "}
                <a
                  target="_blank"
                  href="https://beta.elevenlabs.io/speech-synthesis"
                >
                  ElevenLabs profile
                </a>
                .
              </p>
            }
            validateKey={testKey11Labs}
            closeModal={close}
          />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}
