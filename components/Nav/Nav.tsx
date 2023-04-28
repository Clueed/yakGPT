import NavSettingsCluster from "./NavSettingsCluster";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  MediaQuery,
  Navbar,
  Tooltip,
  createStyles,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconBrandOpenai,
  IconChevronLeft,
  IconChevronRight,
  IconHistory,
  IconKey,
  IconMoon,
  IconPlus,
  IconSettings,
  IconSun,
} from "@tabler/icons-react";
import Link from "next/link";
import SettingsModal from "../Settings/SettingsModal";
import KeyModal from "../Settings/KeyModal";
import { lazy, useState } from "react";

const NavChatHistory = lazy(() => import("./NavChatHistory"));

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

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const DarkModeIcon = colorScheme === "dark" ? IconSun : IconMoon;

  const isSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <Flex
        direction={"column"}
        h={"100vh"}
        p="xxs"
        w={expanded === true ? "12rem" : "5rem"}
        //align={"center"}
        justify={"space-between"}
      >
        <Navbar.Section>
          <Link href={"/"} passHref style={{ textDecoration: "none" }}>
            {expanded === true ? (
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

        <Navbar.Section>
          {expanded === true ? (
            <NavSettingsCluster />
          ) : (
            <ActionIcon
              variant="transparent"
              color="primary.2"
              onClick={() => setExpanded(!expanded)}
            >
              <IconBrandOpenai />
            </ActionIcon>
          )}
        </Navbar.Section>

        {expanded === true ? (
          <Navbar.Section grow mt="md" mb="xxs" sx={{ overflowY: "hidden" }}>
            <NavChatHistory />
          </Navbar.Section>
        ) : (
          <Navbar.Section>
            <ActionIcon
              variant="transparent"
              color="primary.2"
              onClick={() => setExpanded(!expanded)}
            >
              <IconHistory />
            </ActionIcon>
          </Navbar.Section>
        )}

        <Navbar.Section>
          <Group position="apart" mx="md">
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
      </Flex>

      <Box onClick={() => setExpanded(!expanded)} mt="xxl">
        {expanded ? (
          <IconChevronLeft style={{ color: theme.colors.primary[5] }} />
        ) : (
          <IconChevronRight style={{ color: theme.colors.primary[5] }} />
        )}
      </Box>
    </>
  );
}
