import { Chat } from "@/stores/Chat";
import {
  clearChats,
  deleteChat,
  setNavOpened,
  updateChat,
} from "@/stores/ChatActions";
import { useChatStore } from "@/stores/ChatStore";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Modal,
  Text,
  TextInput,
  Tooltip,
  createStyles,
  getStylesRef,
  px,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconArrowRight,
  IconCheck,
  IconEdit,
  IconEditOff,
  IconPencil,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { unset } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const useStyles = createStyles((theme) => ({
  chatHistoryContainer: {
    overflowY: "scroll",
    overflowX: "visible",
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

    [theme.fn.smallerThan("sm")]: {
      fontSize: theme.fontSizes.xl,
      padding: theme.spacing.md,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.xxs,
    },
  },

  link: {
    alignItems: "center",
    flexGap: theme.spacing.xxs,
    flexWrap: "nowrap",
    flexDirection: "row",

    padding: theme.spacing.xxs,
    borderRadius: theme.radius.sm,

    [`&:hover:not(.${getStylesRef("linkActive")})`]: {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },

    [theme.fn.smallerThan("sm")]: {
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    ref: getStylesRef("linkActive"),
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],
    [`& > .${getStylesRef("chatLinkText")}`]: {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[8],
      fontWeight: 600,
    },
  },

  chatLinkText: {
    ref: getStylesRef("chatLinkText"),
    fontWeight: 500,
    fontSize: theme.fontSizes.xs,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    lineHeight: "15px", // depends on icons
    maskImage: "linear-gradient(to right, black 90%, transparent 100%)",
    textOverflow: `clip`,
    overflow: "hidden",
    whiteSpace: "nowrap",
    flexGrow: 1,

    [theme.fn.smallerThan("sm")]: {
      fontSize: theme.fontSizes.xl,
      lineHeight: "40px", // depends on icons
    },
  },
}));

type ChatGroupBase = {
  deltaDays: number;
  label: string;
};

type ChatGroup = ChatGroupBase & {
  chats: Chat[];
};

/**
 * Groups an array of chats by date, based on a given set of date groups.
 *
 * @param {Chat[]} chats - The array of chats to group.
 * @param {ChatGroupBase[]} dateGroups - The array of date groups to use.
 * @return {ChatGroup[]} An array of chat groups, each containing an array of chats.
 */
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

  const router = useRouter();
  const activeChatId = router.query.chatId as string | undefined;

  const isSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const chats = useChatStore((state) => state.chats);

  if (chats.length === 0) {
    return null;
  }

  const dateGroups: ChatGroupBase[] = [
    { deltaDays: 0, label: "Today" },
    { deltaDays: 1, label: "Yesterday" },
    { deltaDays: 7, label: "Last week" },
    { deltaDays: 30, label: "Last month" },
    { deltaDays: 365, label: "Last year" },
  ];
  const groupedChats = groupChatsByDate(chats, dateGroups);

  const [editChatsHistoryView, setEditChatsHistoryView] = useState(false);
  const [clearChatsConfirmed, setClearChatsConfirmed] =
    useState<boolean>(false);

  function handleClearChats() {
    if (clearChatsConfirmed) {
      clearChats();
      router.push("/");
      setClearChatsConfirmed(false);
    } else {
      setClearChatsConfirmed(true);
    }
  }

  useEffect(() => {
    setClearChatsConfirmed(false);
  }, [editChatsHistoryView]);

  return (
    <Flex direction={"column"} sx={{ height: "100%" }} py={"xs"}>
      <Box className={classes.chatHistoryContainer}>
        <Flex direction="column" wrap="nowrap">
          {groupedChats.map((group) => (
            <div key={group.deltaDays}>
              <Text className={classes.groupLabel}>{group.label}</Text>

              <Flex direction={"column"} gap={"3px"}>
                {group.chats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    onClick={() => {
                      if (isSmall) {
                        setNavOpened(false);
                      }
                    }}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <Flex
                      key={chat.id}
                      className={cx(
                        classes.link,
                        chat.id === activeChatId ? classes.linkActive : ""
                      )}
                    >
                      {editChatsHistoryView && (
                        <ActionIcon
                          variant="subtle"
                          pt={2}
                          mr={5}
                          size={isSmall ? 40 : 15}
                          onClick={(event) => {
                            event.preventDefault();
                            deleteChat(chat.id);
                            if (chat.id === activeChatId) {
                              router.push("/");
                            }
                          }}
                        >
                          <IconX
                            stroke={1.5}
                            color={
                              theme.colorScheme === "dark"
                                ? theme.colors.red[3]
                                : theme.colors.red[8]
                            }
                          />
                        </ActionIcon>
                      )}

                      <Text className={classes.chatLinkText}>
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

      <Button.Group px="3px">
        {editChatsHistoryView && (
          <Tooltip
            label={
              clearChatsConfirmed
                ? "Confirm deleting all chats"
                : "Clear chat history"
            }
            withArrow
            color="red.4"
            sx={{
              color: theme.colors.gray[9],
              fontWeight: 500,
            }}
          >
            <ActionIcon
              variant="filled"
              color={theme.colorScheme === "dark" ? "red.5" : "red.3"}
              radius="md"
              sx={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderTopLeftRadius: 0,
                height: "auto",
                paddingLeft: isSmall ? theme.spacing.md : 0,
                paddingRight: isSmall ? theme.spacing.md : 0,
                width: "auto",
              }}
              onClick={() => {
                handleClearChats();
              }}
            >
              {clearChatsConfirmed ? (
                <IconCheck
                  size={isSmall ? 30 : 15}
                  color={theme.colors.gray[8]}
                />
              ) : (
                <IconTrash
                  size={isSmall ? 30 : 15}
                  color={theme.colors.gray[8]}
                />
              )}
            </ActionIcon>
          </Tooltip>
        )}
        <Button
          variant={editChatsHistoryView ? "filled" : "light"}
          color={
            editChatsHistoryView
              ? theme.colorScheme === "dark"
                ? "gray.8"
                : "gray.5"
              : theme.colorScheme === "dark"
              ? "gray.5"
              : "gray.6"
          }
          compact={!isSmall}
          fullWidth
          size={isSmall ? "md" : "md"}
          radius="md"
          onClick={() => setEditChatsHistoryView(!editChatsHistoryView)}
          sx={{
            borderTopRightRadius: 0,
            borderTopLeftRadius: editChatsHistoryView ? "md" : 0,
          }}
          leftIcon={
            editChatsHistoryView ? (
              <IconEditOff size={isSmall ? 25 : 15} />
            ) : (
              <IconEdit size={isSmall ? 25 : 15} />
            )
          }
        >
          {editChatsHistoryView ? "Done editing" : "Edit chat history"}
        </Button>
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
