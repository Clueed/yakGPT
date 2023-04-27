import {
  Badge,
  Box,
  Button,
  Flex,
  Loader,
  PasswordInput,
  Text,
  TextInput,
  Title,
  px,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertSquareRounded,
  IconCheck,
  IconMessage,
  IconMicrophone,
  IconVolume,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";

export type Usage = "TTS" | "STT" | "chat";

export type ApiPanelConfig = {
  initialKey: string | undefined;
  setKeyFun: (key: string) => void;
  validateKey: (key: string, region?: string) => Promise<boolean>;
  descriptionBelowInput: React.ReactNode;
  usage: Usage[];
  initialRegion?: string | undefined;
  setKeyFunRegion?: (key: string) => void;
};

export function APIPanelBase({ config }: { config: ApiPanelConfig }) {
  const [checkStatus, setCheckStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [apiKey, setApiKey] = useState(config.initialKey);
  const [region, setRegion] = useState(config.initialRegion);

  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckStatus("idle");
    setApiKey(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (apiKey) {
      setCheckStatus("loading");

      const keyValid = await config.validateKey(apiKey, region);

      if (keyValid) {
        notifications.show({
          message: "Key saved!",
          color: "green",
        });
        config.setKeyFun(apiKey);
        if (config.setKeyFunRegion && region) {
          config.setKeyFunRegion(region);
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

  const usageMap = {
    STT: { icon: IconMicrophone, description: "Speech-to-text" },
    TTS: { icon: IconVolume, description: "Text-to-speech" },
    chat: { icon: IconMessage, description: "Chat" },
  };

  const theme = useMantineTheme();

  return (
    <form onSubmit={handleSubmit}>
      <Title order={3} size={"0.875rem"} weight={500}>
        Usage
      </Title>
      <Flex direction={"row"} gap={"sm"} mt={"xxxs"} mb="xs">
        {config.usage.map((u) => {
          const Icon = usageMap[u].icon;
          return (
            <Badge
              key={u}
              size="md"
              p="sm"
              color="primary.6"
              radius={"md"}
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
        label={"API key"}
        placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        icon={icon}
        value={apiKey}
        onChange={handleKeyChange}
      />
      {config.setKeyFunRegion && (
        <TextInput
          mt={"xxxs"}
          label="Region"
          placeholder="westus"
          value={region}
          onChange={(event) => setRegion(event.target.value)}
        />
      )}
      <Text size="sm" my="md" color="primary.6">
        {config.descriptionBelowInput}
      </Text>
      <Flex align={"center"} gap={"xs"}>
        <IconAlertSquareRounded
          size={55}
          style={{ margin: 0, padding: 0, width: "auto", height: "auto" }}
          stroke={1}
          color={theme.colors.primary[8]}
        />
        <Text size={"xs"} color={theme.colors.primary[8]}>
          Your API keys are stored locally and are not sent to any third-party
          or intermediate servers.
        </Text>
        <Button
          type="submit"
          disabled={
            config.initialKey === apiKey && config.initialRegion === region
          }
        >
          Save
        </Button>
      </Flex>
    </form>
  );
}
