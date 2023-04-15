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
import { IconArrowRight, IconEdit, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

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
    paddingBottom: theme.spacing.xxxs,
    [theme.fn.smallerThan("sm")]: {
      fontSize: theme.fontSizes.md,
      padding: theme.spacing.sm,
      paddingBottom: theme.spacing.xxs,
      paddingTop: theme.spacing.xl,
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
    padding: `${theme.spacing.xxs + " " + theme.spacing.xs}`,

    [theme.fn.smallerThan("sm")]: {
      fontSize: theme.fontSizes.md,
      padding: `${theme.spacing.xs + " " + theme.spacing.sm}`,
    },
  },

  link: {
    ...theme.fn.focusStyles(),
    //width: "100%",
    //display: "flex",
    alignItems: "center",

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
    marginRight: theme.spacing.sm,
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

  scrollbar: {
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

export default function NavChatHistory({ editChatsHistoryView }) {
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
        className={classes.scrollbar}
        style={{
          overflowX: "hidden",
          overflowY: "scroll",
        }}
        sx={{
          maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          minWidth: 0,
          //lineHeight: "1",
          //backgroundClip: "text",
        }}
      >
        <Flex
          direction="column"
          wrap="nowrap"
          style={{ minWidth: "0 !important" }}
        >
          {groupedChats.map((group) => (
            <div key={group.deltaDays}>
              {editChatsHistoryView && group.label === groupedChats[0].label ? (
                <Flex
                  align={"center"}
                  justify={"space-between"}
                  p="xxs"
                  style={{ position: "relative" }}
                >
                  <Text className={classes.groupLabel}>{group.label}</Text>
                  <Button
                    pl={"auto"}
                    compact={!isSmall}
                    variant="light"
                    size={isSmall ? "md" : "xs"}
                    color={"dark.3"}
                    rightIcon={<IconTrash size={isSmall ? 20 : 15} />}
                  >
                    Clear all chats
                  </Button>
                </Flex>
              ) : (
                <Text className={classes.groupLabel}>{group.label}</Text>
              )}
              <Flex
                direction={"column"}
                style={{ minWidth: "0 !important", overflow: "hidden" }}
              >
                {group.chats.map((chat) => (
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      router.push(`/chat/${chat.id}`);
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
                      //gap={"xxs"}
                      //w={"100%"}
                      style={{
                        minWidth: "0 !important",
                        overflow: "hidden",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                      align={"center"}
                      className={
                        chat.id === activeChatId ? classes.linkActive : ""
                      }
                    >
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
                        <Flex align="center" gap={rem(5)} mr={"xxs"}>
                          <Tooltip label="Edit" withArrow position="right">
                            <a
                              href="#"
                              onClick={(event) => {
                                event.preventDefault();
                                openTitleModal();

                                setEditedTitle(chat.title!);
                                setTimeout(() => {
                                  editTitleInputRef.current?.select();
                                }, 100);
                              }}
                            >
                              <ActionIcon
                                variant="transparent"
                                size={isSmall ? 40 : 20}
                              >
                                <IconEdit
                                  stroke={1.5}
                                  color={theme.colors.dark[2]}
                                />
                              </ActionIcon>
                            </a>
                          </Tooltip>
                          <Tooltip label="Delete" withArrow position="right">
                            <a
                              href="#"
                              onClick={(event) => {
                                event.preventDefault();
                                deleteChat(chat.id);
                                router.push("/");
                              }}
                            >
                              <ActionIcon
                                variant="transparent"
                                size={isSmall ? 40 : 20}
                              >
                                <IconTrash
                                  stroke={1.5}
                                  color={theme.colors.dark[2]}
                                />
                              </ActionIcon>
                            </a>
                          </Tooltip>
                        </Flex>
                      )}
                    </Flex>
                  </a>
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
    </>
  );
}
