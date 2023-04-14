import { deleteChat, setNavOpened, updateChat } from "@/stores/ChatActions";
import { useChatStore } from "@/stores/ChatStore";
import {
  ActionIcon,
  Box,
  Flex,
  Group,
  Modal,
  Navbar,
  Text,
  TextInput,
  Title,
  Tooltip,
  createStyles,
  getStylesRef,
  px,
  rem,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconArrowRight, IconEdit, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

const useStyles = createStyles((theme) => ({
  link: {
    ...theme.fn.focusStyles(),
    width: "100%",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    flexGrow: 1,
    maskImage: "linear-gradient(to right, black 80%, transparent 100%)",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    maskImage: "linear-gradient(to right, black 30%, transparent 90%)",
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },

  scrollbar: {
    scrollbarWidth: "thin",
    scrollbarColor: "transparent transparent",

    "&::-webkit-scrollbar": {
      width: "6px",
    },

    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },

    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
      borderRadius: "20px",
    },
  },
}));

import { Chat } from "@/stores/Chat";

type ChatGroupBase = {
  deltaDays: number;
  label: string;
};

type ChatGroup = ChatGroupBase & {
  chats: Chat[];
};

function groupChatsByDate(chats: Chat[], dateGroups: ChatGroupBase[]) {
  const chatDateGroups: ChatGroup[] = dateGroups.map((group) => ({
    ...group,
    chats: [],
  }));

  const now = new Date();

  for (const chat of chats) {
    const chatDate = new Date(chat.createdAt);
    const diffTime = now.valueOf() - chatDate.valueOf();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    for (const group of chatDateGroups) {
      if (diffDays <= group.deltaDays) {
        group.chats.push(chat);
        break;
      }
    }
  }

  return chatDateGroups.filter((group) => group.chats.length > 0);
}

export default function NavChatHistory() {
  const { classes, cx, theme } = useStyles();
  const router = useRouter();
  const [editedTitle, setEditedTitle] = useState("");
  const [openedTitleModal, { open: openTitleModal, close: closeTitleModal }] =
    useDisclosure(false);
  const submitEditedTitle = () => {
    if (editedTitle.trim()) {
      updateChat({ id: activeChatId, title: editedTitle });
    }
    closeTitleModal();
  };
  const editTitleInputRef = useRef<HTMLInputElement>(null);
  const activeChatId = router.query.chatId as string | undefined;
  const isSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const chats = useChatStore((state) => state.chats);

  const dateGroups: ChatGroupBase[] = [
    { deltaDays: 0, label: "Today" },
    { deltaDays: 1, label: "Yesterday" },
    { deltaDays: 7, label: "Last week" },
    { deltaDays: 30, label: "Last month" },
    { deltaDays: 365, label: "Last year" },
  ];

  const groupedChats = groupChatsByDate(chats, dateGroups);

  return (
    <>
      <Navbar.Section
        grow
        mx="-xs"
        px="xs"
        className={classes.scrollbar}
        style={{
          overflowX: "hidden",
          overflowY: "scroll",
        }}
      >
        <Flex direction="column" wrap="nowrap">
          {groupedChats.map((group) => (
            <div key={group.deltaDays}>
              <Title
                weight={400}
                order={1}
                size={rem(12)}
                p="xxs"
                color={theme.colors.dark[2]}
              >
                {group.label}
              </Title>
              <Flex direction={"column"}>
                {group.chats.map((chat) => (
                  <Group
                    position="apart"
                    key={chat.id}
                    sx={{
                      position: "relative",
                    }}
                  >
                    <a
                      className={cx(classes.link, {
                        [classes.linkActive]: chat.id === activeChatId,
                      })}
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        router.push(`/chat/${chat.id}`);
                        if (isSmall) {
                          setNavOpened(false);
                        }
                      }}
                    >
                      <Box p={chat.id === activeChatId ? "xs" : "xxs"}>
                        <Text size="xs" weight={500} color="dimmed" truncate>
                          {chat.title || "Untitled"}
                        </Text>
                      </Box>
                    </a>
                    {chat.id === activeChatId && (
                      <>
                        <Tooltip label="Delete" withArrow position="right">
                          <a
                            href="#"
                            onClick={(event) => {
                              event.preventDefault();
                              deleteChat(chat.id);
                              router.push("/");
                            }}
                            style={{
                              position: "absolute",
                              right: 0,
                            }}
                          >
                            <ActionIcon
                              variant="transparent"
                              color={theme.colors.dark[2]}
                              size={20}
                            >
                              <IconTrash stroke={1.5} />
                            </ActionIcon>
                          </a>
                        </Tooltip>
                        <Tooltip label="Edit" withArrow position="right">
                          <a
                            href="#"
                            onClick={(event) => {
                              event.preventDefault();
                              openTitleModal();
                              if (isSmall) setNavOpened(false);
                              setEditedTitle(chat.title!);
                              setTimeout(() => {
                                editTitleInputRef.current?.select();
                              }, 100);
                            }}
                            style={{
                              position: "absolute",
                              right: 15,
                            }}
                          >
                            <ActionIcon
                              variant="transparent"
                              size={20}
                              color={theme.colors.dark[2]}
                              mr="xxs"
                            >
                              <IconEdit stroke={1.5} />
                            </ActionIcon>
                          </a>
                        </Tooltip>
                      </>
                    )}
                  </Group>
                ))}
              </Flex>
            </div>
          ))}
        </Flex>
      </Navbar.Section>
      <Modal
        opened={openedTitleModal}
        onClose={closeTitleModal}
        title="Set Chat Title"
      >
        <TextInput
          ref={editTitleInputRef}
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          rightSection={
            <ActionIcon onClick={() => submitEditedTitle()}>
              <IconArrowRight size={px("1.2rem")} stroke={1.5} />
            </ActionIcon>
          }
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              submitEditedTitle();
            }
          }}
        />
      </Modal>
    </>
  );
}
