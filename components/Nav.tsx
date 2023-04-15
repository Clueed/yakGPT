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

  const [editChatsHistoryView, setEditChatsHistoryView] = useState(false);

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
        <NavButton
          Icon={IconPlus}
          text="New Chat"
          handleOnClick={(event) => {
            event.preventDefault();
            router.push("/");
          }}
        />
      </Navbar.Section>

      <NavChatHistory editChatsHistoryView={editChatsHistoryView} />

      <Navbar.Section>
        {
          //<Divider my="xs" />
          //links?.length > 0 &&
          <ClearChatsButton
            handleOnClick={() => {
              clearChats();
              router.push("/");
            }}
          />
        }
        <NavButton
          Icon={IconEdit}
          text="Edit chat history"
          handleOnClick={() => {
            setEditChatsHistoryView(!editChatsHistoryView);
          }}
        />

        <NavButton
          Icon={DarkModeIcon}
          text={
            upperFirst(colorScheme === "light" ? "dark" : "light") + " theme"
          }
          handleOnClick={() => toggleColorScheme()}
        />

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
