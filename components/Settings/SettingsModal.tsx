import * as Azure from "@/stores/AzureSDK";
import { refreshModels, updateSettingsForm } from "@/stores/ChatActions";
import { useChatStore } from "@/stores/ChatStore";
import * as ElevenLabs from "@/stores/ElevenLabs";
import {
  Autocomplete,
  Box,
  Button,
  Group,
  MantineTheme,
  Modal,
  ScrollArea,
  Select,
  Slider,
  Stack,
  Switch,
  Tabs,
  Text,
  TextInput,
  Title,
  createStyles,
  px,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconBrandOpenai,
  IconBrandWindows,
  IconSpeakerphone,
} from "@tabler/icons-react";
import ISO6391 from "iso-639-1";
import { useEffect, useState } from "react";
import { azureCandidateLanguages } from "../azureLangs";
import { APIPanel } from "./APIPanel";

function getLanguages(): Array<{ label: string; value: string }> {
  const languageCodes: Array<string> = ISO6391.getAllCodes();
  return languageCodes.map((code: string) => ({
    label: `${ISO6391.getName(code)} (${code})`,
    value: code,
  }));
}

const useStyles = createStyles((theme: MantineTheme) => ({
  subHeader: {
    fontSize: theme.fontSizes.md,
    //fontWeight: 500,
    color: theme.colors.primary[6],
    marginTop: theme.spacing.xxl,
    paddingTop: theme.spacing.xxl,
    marginBottom: theme.spacing.sm,
  },
}));

export default function SettingsModal({
  opened,
  close,
  onClose,
}: {
  opened: boolean;
  close: () => void;
  onClose: () => void;
}) {
  const modelChoicesChat =
    useChatStore((state) => state.modelChoicesChat) || [];
  const [voices11Labs, setVoices11Labs] = useState<ElevenLabs.Voice[]>([]);
  const [voicesAzure, setVoicesAzure] = useState<Azure.Voice[]>([]);
  const [voiceStylesAzure, setVoiceStylesAzure] = useState<string[]>([]);

  const apiKey11Labs = useChatStore((state) => state.apiKey11Labs);
  const apiKeyAzure = useChatStore((state) => state.apiKeyAzure);
  const apiKeyAzureRegion = useChatStore((state) => state.apiKeyAzureRegion);
  const settingsForm = useChatStore((state) => state.settingsForm);
  const defaultSettings = useChatStore((state) => state.defaultSettings);

  useEffect(() => {
    refreshModels();
  }, []);

  useEffect(() => {
    // Load 11Labs voices11Labs
    async function fetchData() {
      if (!apiKey11Labs) return;

      try {
        const voices11Labs = await ElevenLabs.getVoices(apiKey11Labs);
        setVoices11Labs(voices11Labs);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    }

    fetchData();
  }, [apiKey11Labs]);

  const form = useForm({
    initialValues: settingsForm,
    validate: {
      logit_bias: (value) => {
        try {
          if (value === "") return null;
          const parsed = JSON.parse(value);
          if (typeof parsed !== "object" || Array.isArray(parsed))
            throw new Error();
          for (const key in parsed) {
            const num = parsed[key];
            if (!Number.isFinite(num) || num < -100 || num > 100)
              throw new Error();
          }
          return null;
        } catch {
          return "Logit bias must be a valid JSON object with keys representing token IDs and values between -100 and 100";
        }
      },
    },
  });

  useEffect(() => {
    // Load Azure voices
    async function fetchData() {
      if (!apiKeyAzure || !apiKeyAzureRegion) return;
      const voices = await Azure.getVoices(apiKeyAzure, apiKeyAzureRegion);
      if (!voices) return;
      setVoicesAzure(voices);
    }

    fetchData();
  }, [apiKeyAzure, apiKeyAzureRegion]);

  useEffect(() => {
    setVoiceStylesAzure(
      voicesAzure.find(
        (voice) => voice.shortName === form.values.voice_id_azure
      )?.styleList || []
    );
  }, [voicesAzure, form.values.voice_id_azure]);

  const languages = getLanguages();
  const langDisplayToCode = languages.reduce((acc, cur) => {
    acc[cur.label] = cur.value;
    return acc;
  }, {} as Record<string, string>);

  const { classes, theme } = useStyles();

  return (
    <Modal opened={opened} onClose={onClose} title="Settings" zIndex={9999}>
      <Box mx="0">
        <Tabs defaultValue="openai" variant="pills" color={"primary.6"}>
          <Tabs.List grow mb={"md"}>
            <Tabs.Tab
              value="openai"
              icon={<IconBrandOpenai stroke={1.5} size={px("1.3rem")} />}
            >
              OpenAI
            </Tabs.Tab>
            <Tabs.Tab
              value="azure"
              icon={<IconBrandWindows stroke={1.5} size={px("1.3rem")} />}
            >
              Azure
            </Tabs.Tab>
            <Tabs.Tab
              value="elevenLabs"
              icon={<IconSpeakerphone stroke={1.5} size={px("1.3rem")} />}
            >
              Eleven Labs
            </Tabs.Tab>
          </Tabs.List>

          <ScrollArea.Autosize
            type="hover"
            offsetScrollbars
            //h="100%"
            mah={"70vh"}
            //sx={{ maxHeight: "70vh" }}
          >
            <Tabs.Panel value="openai" pt="xs">
              <APIPanel provider="openAi" />
              <form
                onSubmit={form.onSubmit((values) => {
                  updateSettingsForm(values);
                  close();
                })}
              >
                <>
                  <Title order={1} className={classes.subHeader}>
                    General
                  </Title>
                  <Stack>
                    <Select
                      required
                      label="Model"
                      placeholder="Select a model"
                      value={form.values.model}
                      onChange={(value) => form.setFieldValue("model", value!)}
                      data={modelChoicesChat.map((model) => ({
                        label: model,
                        value: model,
                      }))}
                    ></Select>
                    <label>
                      <Text size="sm">Sampling temperature</Text>
                      <Slider
                        value={form.values.temperature}
                        label={form.values.temperature}
                        color="primary.3"
                        min={0}
                        max={2}
                        step={0.1}
                        precision={1}
                        onChange={(value) =>
                          form.setFieldValue("temperature", value)
                        }
                      />
                    </label>
                    <Switch
                      checked={form.values.auto_title}
                      label="Automatically use model to find chat title"
                      onChange={(event) =>
                        form.setFieldValue(
                          "auto_title",
                          event.currentTarget.checked
                        )
                      }
                    />
                  </Stack>
                  <Title order={1} className={classes.subHeader}>
                    Advanced
                  </Title>
                  <Stack>
                    <label>
                      <Text size="sm">Top P</Text>
                      <Slider
                        value={form.values.top_p}
                        min={0}
                        max={1}
                        step={0.01}
                        color={"primary.3"}
                        precision={2}
                        label={form.values.top_p}
                        onChange={(value) => form.setFieldValue("top_p", value)}
                      />
                    </label>
                    <label>
                      <Text size="sm">N</Text>
                      <Slider
                        value={form.values.n}
                        label={form.values.n}
                        color={"primary.3"}
                        min={1}
                        max={10}
                        step={1}
                        onChange={(value) => form.setFieldValue("n", value)}
                      />
                    </label>
                    <TextInput
                      label="Stop"
                      placeholder="Up to 4 sequences where the API will stop generating further tokens"
                      {...form.getInputProps("stop")}
                    />
                    <label>
                      <Text size="sm">Max Tokens</Text>
                      <Slider
                        color={"primary.3"}
                        value={form.values.max_tokens}
                        label={
                          form.values.max_tokens === 0
                            ? "Unlimited"
                            : form.values.max_tokens
                        }
                        min={0}
                        max={4000}
                        step={1}
                        onChange={(value) =>
                          form.setFieldValue("max_tokens", value)
                        }
                      />
                    </label>
                    <label>
                      <Text size="sm">Presence Penalty</Text>
                      <Slider
                        value={form.values.presence_penalty}
                        label={form.values.presence_penalty}
                        color={"primary.3"}
                        min={-2}
                        max={2}
                        step={0.1}
                        precision={1}
                        onChange={(value) =>
                          form.setFieldValue("presence_penalty", value)
                        }
                      />
                    </label>
                    <label>
                      <Text size="sm">Frequency Penalty</Text>
                      <Slider
                        value={form.values.frequency_penalty}
                        label={form.values.frequency_penalty}
                        color={"primary.3"}
                        min={-2}
                        max={2}
                        step={0.1}
                        precision={1}
                        onChange={(value) =>
                          form.setFieldValue("frequency_penalty", value)
                        }
                      />
                    </label>
                    <TextInput
                      label="Logit Bias"
                      placeholder='{"token_id": 0.5, "token_id_2": -0.5}'
                      {...form.getInputProps("logit_bias")}
                    />
                  </Stack>
                  <Title order={1} className={classes.subHeader}>
                    Whisper (Speech to Text)
                  </Title>
                  <Stack>
                    <Switch
                      checked={form.values.auto_detect_language}
                      label="Auto-detect language"
                      onChange={(event) => {
                        form.setFieldValue(
                          "auto_detect_language",
                          event.currentTarget.checked
                        );
                      }}
                    />
                    <Autocomplete
                      disabled={form.values.auto_detect_language}
                      label="Spoken language (choosing gives better accuracy)"
                      value={form.values.spoken_language}
                      onChange={(value) => {
                        form.setFieldValue("spoken_language", value!);
                        form.setFieldValue(
                          "spoken_language_code",
                          langDisplayToCode[value!]
                        );
                      }}
                      data={getLanguages().map((lang) => lang.label)}
                    />
                  </Stack>
                </>
              </form>
            </Tabs.Panel>
            <Tabs.Panel value="azure" pt="xs">
              <APIPanel provider="azure" />
              <form
                onSubmit={form.onSubmit((values) => {
                  updateSettingsForm(values);
                  close();
                })}
              >
                <>
                  <Title order={1} className={classes.subHeader}>
                    Speech to Text
                  </Title>
                  <Stack>
                    <Switch
                      checked={form.values.auto_detect_language_azure}
                      label="Auto-detect language"
                      onChange={(event) => {
                        form.setFieldValue(
                          "auto_detect_language_azure",
                          event.currentTarget.checked
                        );
                      }}
                    />
                    <Autocomplete
                      disabled={form.values.auto_detect_language_azure}
                      label="Spoken language (choosing gives better accuracy)"
                      value={form.values.spoken_language_azure}
                      onChange={(value) => {
                        const key = Object.entries(
                          azureCandidateLanguages
                        ).find(([, v]) => v === value);
                        if (key) {
                          form.setFieldValue(
                            "spoken_language_code_azure",
                            key[0]
                          );
                        }

                        form.setFieldValue("spoken_language_azure", value!);
                      }}
                      data={Object.values(azureCandidateLanguages)}
                    />
                  </Stack>
                  <Title order={1} className={classes.subHeader}>
                    Text to Speech
                  </Title>
                  <Stack>
                    <Autocomplete
                      label="Voice"
                      placeholder="Select a voice"
                      value={form.values.voice_id_azure}
                      onChange={(value) => {
                        setVoiceStylesAzure(
                          voicesAzure.find((voice) => voice.shortName === value)
                            ?.styleList || []
                        );
                        form.setFieldValue("voice_id_azure", value!);
                      }}
                      data={voicesAzure.map((voice) => ({
                        label: voice.shortName,
                        value: voice.shortName,
                      }))}
                    ></Autocomplete>
                    <Select
                      label="Voice style"
                      disabled={voiceStylesAzure.length === 0}
                      placeholder="Select a voice style"
                      value={form.values.spoken_language_style}
                      onChange={(value) =>
                        form.setFieldValue("spoken_language_style", value!)
                      }
                      data={voiceStylesAzure}
                    ></Select>
                  </Stack>
                </>
              </form>
            </Tabs.Panel>
            <Tabs.Panel value="elevenLabs" pt="xs">
              <APIPanel provider="elevenLabs" />
              <form
                onSubmit={form.onSubmit((values) => {
                  updateSettingsForm(values);
                  close();
                })}
              >
                <Select
                  required
                  label="Voice"
                  placeholder="Select a voice"
                  value={form.values.voice_id}
                  onChange={(value) => form.setFieldValue("voice_id", value!)}
                  data={voices11Labs.map((voice) => ({
                    label: voice.name,
                    value: voice.voice_id,
                  }))}
                ></Select>
              </form>
            </Tabs.Panel>
          </ScrollArea.Autosize>
        </Tabs>
        <Group position="apart" mt="md">
          <Button
            variant="light"
            onClick={() => {
              form.setValues(defaultSettings);
            }}
          >
            Reset
          </Button>
          <Button type="submit">Save</Button>
        </Group>
      </Box>
    </Modal>
  );
}
