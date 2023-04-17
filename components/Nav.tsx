import { useChatStore } from "@/stores/ChatStore";
import {
  Burger,
  Button,
  Divider,
  MediaQuery,
  Modal,
  Navbar,
  Space,
  createStyles,
  getStylesRef,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import { upperFirst, useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconEdit,
  IconKey,
  IconMoon,
  IconPlus,
  IconSettings,
  IconSun,
} from "@tabler/icons-react";
import ClearChatsButton from "./ClearChatsButton";
import KeyModal from "./KeyModal";
import SettingsModal from "./SettingsModal";
import { useRouter } from "next/router";
import { clearChats, setNavOpened } from "@/stores/ChatActions";
import NavChatHistory from "./NavChatHistory";
import NavButton from "./NavButton";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  secondaryButton: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[6],

    fontWeight: 500,

    [":hover"]: {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[0]
          : theme.colors.gray[7],
    },
  },

  secondaryButtonIcon: {
    strokeWidth: 1.5,
    width: 20,
    height: 20,
  },
}));

export default function NavbarSimple() {
  const { classes, cx, theme } = useStyles();

  const router = useRouter();

  const [openedKeyModal, { open: openKeyModal, close: closeKeyModal }] =
    useDisclosure(false);
  const [
    openedSettingsModal,
    { open: openSettingsModal, close: closeSettingsModal },
  ] = useDisclosure(false);

  const navOpened = useChatStore((state) => state.navOpened);

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const DarkModeIcon = colorScheme === "dark" ? IconSun : IconMoon;

  const isSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Navbar
      height={"100%"}
      p="xxs"
      hiddenBreakpoint="sm"
      hidden={!navOpened}
      width={{ sm: 200, lg: 200 }}
      sx={{ zIndex: 1001 }}
      withBorder={false}
    >
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Space h="xl" />
      </MediaQuery>
      <Navbar.Section>
        <Button
          variant="light"
          onClick={(event) => {
            event.preventDefault();
            router.push("/");
          }}
          fullWidth
          mb={"md"}
          leftIcon={<IconPlus />}
        >
          New Chat
        </Button>
      </Navbar.Section>

      <NavChatHistory />

      <Navbar.Section>
        <Button
          variant="subtle"
          compact
          className={classes.secondaryButton}
          onClick={() => toggleColorScheme()}
          leftIcon={<DarkModeIcon className={classes.secondaryButtonIcon} />}
        >
          {upperFirst(colorScheme === "light" ? "dark" : "light")} theme
        </Button>

        <Modal
          opened={openedKeyModal}
          onClose={closeKeyModal}
          title="API Keys"
          zIndex={9999}
        >
          <KeyModal close={closeKeyModal} />
        </Modal>

        <Modal
          opened={openedSettingsModal}
          onClose={closeSettingsModal}
          title="Settings"
          zIndex={9999}
        >
          <SettingsModal close={closeSettingsModal} />
        </Modal>

        <Button
          variant="subtle"
          compact
          className={classes.secondaryButton}
          onClick={() => {
            openedSettingsModal && closeSettingsModal();
            openKeyModal();
            if (isSmall) setNavOpened(false);
          }}
          leftIcon={<IconKey className={classes.secondaryButtonIcon} />}
        >
          API Keys
        </Button>

        <Button
          variant="subtle"
          compact
          className={classes.secondaryButton}
          onClick={() => {
            openedKeyModal && closeKeyModal();
            openSettingsModal();

            if (isSmall) setNavOpened(false);
          }}
          leftIcon={<IconSettings className={classes.secondaryButtonIcon} />}
        >
          Settings
        </Button>
      </Navbar.Section>
    </Navbar>
  );
}
