import { deleteChat, setNavOpened, updateChat } from "@/stores/ChatActions";
import { useChatStore } from "@/stores/ChatStore";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Navbar,
  Text,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
  createStyles,
  getStylesRef,
  px,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconArrowRight,
  IconCheck,
  IconEdit,
  IconPencil,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { clearChats } from "@/stores/ChatActions";
const useStyles = createStyles((theme) => ({
  groupLabel: {
    fontWeight: 500,
    fontSize: theme.fontSizes.xs,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
    padding: theme.spacing.xxs,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxs,
  },

  chatLinkText: {
    ref: getStylesRef("chatLinkText"),
    fontWeight: 500,
    fontSize: theme.fontSizes.xs,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    lineHeight: "15px",
  },

  link: {
    ...theme.fn.focusStyles(),
    //width: "100%",
    //display: "flex",
    alignItems: "center",
    padding: `${theme.spacing.xxs + " " + "0"}`,
    borderRadius: theme.radius.sm,

    //flexGrow: 1,

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
    //marginRight: theme.spacing.sm,
  },

  linkActive: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],
    borderRadius: theme.radius.sm,
    [`& > .${getStylesRef("chatLinkText")}`]: {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[9],
    },
  },

  chatHistoryContainer: {
    overflowX: "hidden",
    overflowY: "scroll",
    maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
    height: "100%",

    scrollbarWidth: "thin",
    scrollbarColor: "transparent transparent",

    "&::-webkit-scrollbar": {
      width: "0px",
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
import ClearChatsButton from "./ClearChatsButton";
import Link from "next/link";

type ChatGroupBase = {
  deltaDays: number;
  label: string;
};

type ChatGroup = ChatGroupBase & {
  chats: Chat[];
};

function groupChatsByDate(chats: Chat[], dateGroups: ChatGroupBase[]) {
  const sortedChats = [...chats].sort(
    (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
  );

  const chatDateGroups: ChatGroup[] = dateGroups.map((group) => ({
    ...group,
    chats: [],
  }));

  const now = new Date();

  for (const chat of sortedChats) {
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

  const [editChatsHistoryView, setEditChatsHistoryView] = useState(false);

  return (
    <Flex direction={"column"} sx={{ minHeight: 0, height: "100%" }} py={"xs"}>
      <Box className={classes.chatHistoryContainer}>
        <Flex
          direction="column"
          wrap="nowrap"
          style={{ minWidth: "0 !important" }}
        >
          {groupedChats.map((group) => (
            <div key={group.deltaDays}>
              <Text className={classes.groupLabel}>{group.label}</Text>

              <Flex
                direction={"column"}
                gap={"3px"}
                style={{
                  minWidth: "0 !important",
                  overflow: "hidden",
                  transition: "all 1s",
                }}
              >
                {group.chats.map((chat) => (
                  <Link
                    href={`/chat/${chat.id}`}
                    onClick={() => {
                      if (isSmall) {
                        setNavOpened(false);
                      }
                    }}
                    style={{
                      textDecoration: "none",
                      cursor: "pointer",
                      flexShrink: 1,
                      minWidth: 0,
                      flexGrow: 1,
                    }}
                  >
                    <Flex
                      key={chat.id}
                      direction="row"
                      wrap="nowrap"
                      gap={"xxs"}
                      //w={"100%"}
                      style={{
                        transition: "all 0.5s",
                        minWidth: "0 !important",
                        overflow: "hidden",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                      px={"xxs"}
                      align={"center"}
                      className={cx(
                        classes.link,
                        chat.id === activeChatId ? classes.linkActive : ""
                      )}
                    >
                      {editChatsHistoryView && (
                        <ActionIcon
                          variant="subtle"
                          size={isSmall ? 40 : 15}
                          onClick={(event) => {
                            event.preventDefault();
                            deleteChat(chat.id);
                            if (chat.id === activeChatId) {
                              router.push("/");
                            }
                          }}
                        >
                          <IconX stroke={1.5} color={theme.colors.red[3]} />
                        </ActionIcon>
                      )}
                      <Text
                        className={classes.chatLinkText}
                        weight={500}
                        style={{
                          minWidth: 0,
                          textOverflow: `clip`,
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          flexGrow: 1,
                          //lineHeight: "1",
                        }}
                        sx={{
                          minWidth: 0,
                          //lineHeight: "1",
                          //backgroundClip: "text",
                          maskImage:
                            "linear-gradient(to right, black 95%, transparent 100%)",
                        }}
                      >
                        {chat.title || "Untitled"}
                      </Text>

                      {editChatsHistoryView && (
                        <ActionIcon
                          variant="subtle"
                          size={isSmall ? 40 : 15}
                          onClick={(event) => {
                            event.preventDefault();
                            openTitleModal();

                            setEditedTitle(chat.title!);
                            setTimeout(() => {
                              editTitleInputRef.current?.select();
                            }, 100);
                          }}
                        >
                          <IconPencil
                            stroke={1.5}
                            color={theme.colors.dark[2]}
                          />
                        </ActionIcon>
                      )}
                    </Flex>
                  </Link>
                ))}
              </Flex>
            </div>
          ))}
        </Flex>
      </Box>
      {
        //<Divider my="xs" />
        //links?.length > 0 &&
      }

      <Button.Group px="3px">
        {editChatsHistoryView && (
          <Tooltip label={"Clear chat history"} withArrow color="red.4">
            <ActionIcon
              variant="filled"
              color="red.5"
              sx={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                height: "auto",
                minHeight: 0,
                padding: "auto",
              }}
              onClick={() => setEditChatsHistoryView(!editChatsHistoryView)}
            >
              <IconTrash size={15} color={theme.colors.gray[8]} />
            </ActionIcon>
          </Tooltip>
        )}
        <Button
          variant={editChatsHistoryView ? "filled" : "light"}
          color={editChatsHistoryView ? "gray.8" : "gray.6"}
          compact
          fullWidth
          onClick={() => setEditChatsHistoryView(!editChatsHistoryView)}
          leftIcon={
            editChatsHistoryView ? (
              <IconCheck size={15} />
            ) : (
              <IconEdit size={15} />
            )
          }
          sx={{ transition: "all 0.1s" }}
        >
          {editChatsHistoryView ? "Done editing" : "Edit chat history"}
        </Button>

        {
          // <ClearChatsButton
          //  handleOnClick={() => {
          //    clearChats();
          //    router.push("/");
          //  }}
          ///>
        }
      </Button.Group>
      <Modal
        opened={openedTitleModal}
        onClose={closeTitleModal}
        title="Set Chat Title"
        zIndex={9999}
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
    </Flex>
  );
}
