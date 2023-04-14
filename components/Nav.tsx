import { useChatStore } from "@/stores/ChatStore";
import {
  Burger,
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

const useStyles = createStyles((theme) => ({}));

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
      p="xs"
      hiddenBreakpoint="sm"
      hidden={!navOpened}
      width={{ sm: 200, lg: 200 }}
      sx={{ zIndex: 1001 }}
    >
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Space h="xl" />
      </MediaQuery>
      <Navbar.Section>
        <NavButton
          Icon={IconPlus}
          text="New Chat"
          handleOnClick={(event) => {
            event.preventDefault();
            router.push("/");
          }}
        />
      </Navbar.Section>

      <NavChatHistory />

      <Navbar.Section>
        <Divider my="xs" />
        {
          //links?.length > 0 &&
          <ClearChatsButton
            handleOnClick={() => {
              clearChats();
              router.push("/");
            }}
          />
        }

        <NavButton
          Icon={DarkModeIcon}
          text={
            upperFirst(colorScheme === "light" ? "dark" : "light") + " theme"
          }
          handleOnClick={() => toggleColorScheme()}
        />

        <Modal opened={openedKeyModal} onClose={closeKeyModal} title="API Keys">
          <KeyModal close={closeKeyModal} />
        </Modal>

        <Modal
          opened={openedSettingsModal}
          onClose={closeSettingsModal}
          title="Settings"
        >
          <SettingsModal close={closeSettingsModal} />
        </Modal>

        <NavButton
          Icon={IconKey}
          text="API Keys"
          handleOnClick={(event) => {
            event.preventDefault();
            openedSettingsModal && closeSettingsModal();
            openKeyModal();
            if (isSmall) setNavOpened(false);
          }}
        />
        <NavButton
          Icon={IconSettings}
          text="Settings"
          handleOnClick={(event) => {
            event.preventDefault();
            openedKeyModal && closeKeyModal();
            openSettingsModal();

            if (isSmall) setNavOpened(false);
          }}
        />
      </Navbar.Section>
    </Navbar>
  );
}
