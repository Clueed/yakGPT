import { setNavOpened } from "@/stores/ChatActions";
import { useChatStore } from "@/stores/ChatStore";
import {
  Button,
  MediaQuery,
  Navbar,
  Space,
  createStyles,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconMoon,
  IconPlus,
  IconSettings,
  IconSun
} from "@tabler/icons-react";
import Link from "next/link";
import SettingsModal from "../Settings/SettingsModal";
import NavChatHistory from "./NavChatHistory";

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
        <Link href={"/"} passHref style={{ textDecoration: "none" }}>
          <Button variant="light" fullWidth leftIcon={<IconPlus />}>
            New Chat
          </Button>
        </Link>
      </Navbar.Section>

      <Navbar.Section grow my="md" sx={{ overflowY: "hidden" }}>
        <NavChatHistory />
      </Navbar.Section>

      <Navbar.Section>
        <Button
          variant="subtle"
          compact
          className={classes.secondaryButton}
          onClick={() => toggleColorScheme()}
          leftIcon={<DarkModeIcon className={classes.secondaryButtonIcon} />}
        >
          {colorScheme === "light" ? "Dark" : "Light"} theme
        </Button>

        <Button
          variant="subtle"
          compact
          className={classes.secondaryButton}
          onClick={() => {
            openSettingsModal();

            if (isSmall) setNavOpened(false);
          }}
          leftIcon={<IconSettings className={classes.secondaryButtonIcon} />}
        >
          Settings
        </Button>

        <SettingsModal
          close={closeSettingsModal}
          opened={openedSettingsModal}
          onClose={closeSettingsModal}
        />
      </Navbar.Section>
    </Navbar>
  );
}
