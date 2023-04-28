import { updateSettingsForm } from "@/stores/ChatActions";
import { useChatStore } from "@/stores/ChatStore";
import { Select, Slider, Stack, Text, useMantineTheme } from "@mantine/core";

export default function NavSettingsCluster({}) {
  const modelChoicesChat =
    useChatStore((state) => state.modelChoicesChat) || [];

  const settingsForm = useChatStore((state) => state.settingsForm);

  const theme = useMantineTheme();

  return (
    <Stack my={theme.spacing.xl}>
      <Select
        label={
          <Text
            size="sm"
            fw={400}
            mb={theme.spacing.xxxs}
            color={
              theme.colorScheme === "dark"
                ? theme.colors.dark[2]
                : theme.colors.primary[5]
            }
          >
            Model
          </Text>
        }
        placeholder="Select a model"
        value={settingsForm.model}
        onChange={(value) =>
          updateSettingsForm({ ...settingsForm, model: value! })
        }
        data={modelChoicesChat.map((model) => ({
          label: model,
          value: model,
        }))}
      />
      <label>
        <Text
          size="sm"
          fw={400}
          mb={theme.spacing.xxxs}
          color={
            theme.colorScheme === "dark"
              ? theme.colors.dark[2]
              : theme.colors.primary[5]
          }
        >
          Sampling temperature
        </Text>
        <Slider
          value={settingsForm.temperature}
          label={settingsForm.temperature}
          color="primary.3"
          min={0}
          max={2}
          step={0.1}
          precision={1}
          onChange={(value) =>
            updateSettingsForm({ ...settingsForm, temperature: value })
          }
        />
      </label>
    </Stack>
  );
}
