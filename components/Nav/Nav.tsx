import {
  ActionIcon,
  Button,
  Flex,
  Navbar,
  Tooltip,
  createStyles,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconBrandOpenai,
  IconHistory,
  IconKey,
  IconMoon,
  IconPlus,
  IconSettings,
  IconSun,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import KeyModal from "../Settings/KeyModal";
import SettingsModal from "../Settings/SettingsModal";
import NavChatHistory from "./NavChatHistory";
import NavSettingsCluster from "./NavSettingsCluster";
import { relative } from "path";

const useStyles = createStyles((theme) => ({
  navBar: {
    transition: "background-color 0.5s ease-in-out",
    "&:hover": {
      backgroundColor: theme.colors.primary[0] + "40",
    },
  },
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

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const DarkModeIcon = colorScheme === "dark" ? IconSun : IconMoon;

  const isSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [expanded, setExpanded] = useState(isSmall);

  return (
    <>
      <Flex
        className={classes.navBar}
        direction={"column"}
        h={"100vh"}
        p="xxs"
        w={expanded ? "12rem" : "3rem"}
        align={expanded ? "stretch" : "center"}
        justify={"space-between"}
        gap="lg"
        onClick={() => setExpanded(!expanded)}
      >
        <Navbar.Section>
          <Link href={"/"} passHref style={{ textDecoration: "none" }}>
            {expanded ? (
              <Button
                variant="filled"
                fullWidth
                leftIcon={<IconPlus />}
                color="primary.4"
              >
                New Chat
              </Button>
            ) : (
              <ActionIcon variant="filled" color="primary.4">
                <IconPlus />
              </ActionIcon>
            )}
          </Link>
        </Navbar.Section>

        {expanded ? (
          <>
            <Navbar.Section>
              <NavSettingsCluster />
            </Navbar.Section>
            <Navbar.Section grow sx={{ overflowY: "hidden" }}>
              <NavChatHistory />
            </Navbar.Section>
          </>
        ) : (
          <Navbar.Section grow>
            <ActionIcon variant="subtle" color="primary.2">
              <IconBrandOpenai />
            </ActionIcon>
            <ActionIcon mt="lg" variant="subtle" color="primary.2">
              <IconHistory />
            </ActionIcon>
          </Navbar.Section>
        )}

        <Navbar.Section>
          <Flex
            wrap="wrap-reverse"
            justify="space-between"
            mx="md"
            w="auto"
            gap="md"
          >
            <Tooltip withArrow label="Settings">
              <ActionIcon
                variant="subtle"
                className={classes.secondaryButton}
                onClick={() => {
                  openSettingsModal();
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
          </Flex>
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
      </Flex>
    </>
  );
}
