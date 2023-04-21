import { deleteChat, setNavOpened, updateChat } from "@/stores/ChatActions";
import { useChatStore } from "@/stores/ChatStore";
import {
  ActionIcon,
  Box,
  Flex,
  Modal,
  Text,
  TextInput,
  createStyles,
  getStylesRef,
  px,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconArrowRight, IconPencil, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import ChatHistoryEditButton from "./ChatHistoryEditButton";
import groupChatsByDate, { defaultDateGroups } from "./groupChatsByDate";

const useStyles = createStyles((theme) => ({
  chatHistoryContainer: {
    overflowY: "scroll",
    overflowX: "visible",
    maskImage: "linear-gradient(to bottom, black 95%, transparent 100%)",
    maxHeight: "100%",
    paddingTop: theme.spacing.xxs,
    paddingBottom: theme.spacing.xxs,

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

  listItem: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },

  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    paddingBottom: theme.spacing.xxs,
  },

  groupLabel: {
    fontWeight: 500,
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.xxs,
    paddingRight: theme.spacing.xxs,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
    paddingBottom: theme.spacing.xxxs,

    [theme.fn.smallerThan("sm")]: {
      fontSize: theme.fontSizes.xl,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.xxs,
    },
    ["&.li:first-of-type"]: {
      color: theme.colors.red[6],
    },
  },

  link: {
    alignItems: "center",
    //flexGap: theme.spacing.xxs,
    flexWrap: "nowrap",
    flexDirection: "row",

    paddingLeft: theme.spacing.xxs,
    paddingRight: theme.spacing.xxs,
    paddingTop: theme.spacing.xxs,
    paddingBottom: theme.spacing.xxs,

    [`&:hover:not(.${getStylesRef("linkActive")})`]: {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[1],
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
  const groupedChats = groupChatsByDate(chats, defaultDateGroups);

  const [editChatsHistory, setEditChatsHistory] = useState(false);

  if (chats.length === 0) {
    setEditChatsHistory(false);
    return null;
  }

  return (
    <Flex
      direction={"column"}
      sx={{
        maxHeight: "100%",
        borderRadius: theme.spacing.xxs,
        overflow: "hidden",
      }}
      bg="gray.0"
    >
      <Box className={classes.chatHistoryContainer}>
        <ul className={classes.list}>
          {groupedChats.map((group) => (
            <li key={group.deltaDays} className={classes.listItem}>
              <Text className={classes.groupLabel}>{group.label}</Text>
              <ul className={classes.list}>
                {group.chats.map((chat) => (
                  <li className={classes.listItem}>
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
                        {editChatsHistory && (
                          <ActionIcon
                            variant="subtle"
                            pt={1} // fixing vertical alignment
                            mr={"xxxs"} // not neccesarry on other side b/c of fade
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

                        {editChatsHistory && (
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
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Box>
      <Flex wrap={"nowrap"} direction={"row"}>
        <ChatHistoryEditButton
          setEditMode={setEditChatsHistory}
          editMode={editChatsHistory}
        />
      </Flex>
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
