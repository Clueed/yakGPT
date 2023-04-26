import { setNavOpened } from "@/stores/ChatActions";
import { useChatStore } from "@/stores/ChatStore";
import {
  ActionIcon,
  Button,
  Group,
  Navbar,
  Tooltip,
  createStyles,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconKey,
  IconMoon,
  IconPlus,
  IconSettings,
  IconSun,
} from "@tabler/icons-react";
import Link from "next/link";
import SettingsModal from "../Settings/SettingsModal";
import { NavChatHistory } from "./NavChatHistory";
import KeyModal from "../Settings/KeyModal";

const useStyles = createStyles((theme) => ({
  secondaryButton: {
    color: theme.colors.primary[5],

    fontWeight: 500,

    transition: "transform 0.2s ease-in-out",

    [":hover"]: {
      color: theme.colors.primary[9],
      transform: "scale(1.1)",
    },
  },

  secondaryButtonIcon: {
    strokeWidth: 1.75,
    width: 20,
    height: 20,
  },
}));

export default function NavbarSimple() {
  const { classes, cx, theme } = useStyles();

  const [
    openedSettingsModal,
    { open: openSettingsModal, close: closeSettingsModal },
  ] = useDisclosure(false);

  const [openedKeyModal, { open: openKeyModal, close: closeKeyModal }] =
    useDisclosure(false);

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
      <Navbar.Section>
        <Link href={"/"} passHref style={{ textDecoration: "none" }}>
          <Button
            variant="filled"
            fullWidth
            leftIcon={<IconPlus />}
            color="primary.4"
          >
            New Chat
          </Button>
        </Link>
      </Navbar.Section>

      <Navbar.Section grow mt="md" mb="xxs" sx={{ overflowY: "hidden" }}>
        <NavChatHistory />
      </Navbar.Section>

      <Navbar.Section>
        <Group position="apart" mx="md">
          <Tooltip withArrow label="Settings">
            <ActionIcon
              variant="subtle"
              className={classes.secondaryButton}
              onClick={() => {
                openSettingsModal();

                if (isSmall) setNavOpened(false);
              }}
            >
              <IconSettings className={classes.secondaryButtonIcon} />
            </ActionIcon>
          </Tooltip>
          <Tooltip withArrow label="API keys">
            <ActionIcon
              variant="subtle"
              className={classes.secondaryButton}
              onClick={() => {
                openedSettingsModal && closeSettingsModal();
                openKeyModal();
                if (isSmall) setNavOpened(false);
              }}
            >
              <IconKey className={classes.secondaryButtonIcon} />
            </ActionIcon>
          </Tooltip>
          <Tooltip
            withArrow
            label={(colorScheme === "light" ? "Dark" : "Light") + " theme"}
          >
            <ActionIcon
              variant="subtle"
              className={classes.secondaryButton}
              onClick={() => toggleColorScheme()}
            >
              <DarkModeIcon className={classes.secondaryButtonIcon} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <SettingsModal
          close={closeSettingsModal}
          opened={openedSettingsModal}
          onClose={closeSettingsModal}
        />
        <KeyModal
          close={closeKeyModal}
          opened={openedKeyModal}
          onClose={closeKeyModal}
        />
      </Navbar.Section>
    </Navbar>
  );
}
