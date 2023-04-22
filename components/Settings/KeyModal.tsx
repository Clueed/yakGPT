import { Box, Modal, Tabs, px } from "@mantine/core";
import {
  IconBrandOpenai,
  IconBrandWindows,
  IconSpeakerphone,
} from "@tabler/icons-react";

import { APIPanel } from "./APIPanel";

export default function KeyModal({
  opened,
  close,
  onClose,
}: {
  opened: boolean;
  close: () => void;
  onClose: () => void;
}) {
  return (
    <Modal opened={opened} onClose={onClose} title="API Keys" zIndex={9999}>
      <Box mx="auto">
        <Tabs defaultValue="openai" variant="pills" color={"primary.6"}>
          <Tabs.List grow>
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

          <Tabs.Panel value="openai" pt="md">
            <APIPanel provider="openAi" />
          </Tabs.Panel>
          <Tabs.Panel value="azure" pt="xs">
            <APIPanel provider="azure" />
          </Tabs.Panel>
          <Tabs.Panel value="elevenLabs" pt="xs">
            <APIPanel provider="elevenLabs" />
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Modal>
  );
}
