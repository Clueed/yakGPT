import { Chat } from "@/stores/Chat";
import { deleteChat } from "@/stores/ChatActions";
import {
  ActionIcon,
  Flex,
  Text,
  createStyles,
  getStylesRef,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPencil, IconX } from "@tabler/icons-react";
import Link from "next/link";
import router from "next/router";

const useStyles = createStyles((theme) => ({
  listItem: {
    listStyle: "none",
    margin: 0,
    padding: 0,
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

    transition: "background-color 0.5s ease-out",

    [`&:hover:not(.${getStylesRef("linkActive")})`]: {
      backgroundColor: theme.colors.primary[1],
    },

    [theme.fn.smallerThan("sm")]: {
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    ref: getStylesRef("linkActive"),
    backgroundColor: theme.colors.primary[2],
    [`& > .${getStylesRef("chatLinkText")}`]: {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.primary[9],
      fontWeight: 600,
    },
  },

  chatLinkText: {
    ref: getStylesRef("chatLinkText"),
    fontWeight: 500,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.primary[6],
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

  icon: {
    strokeWidth: 1.9,
    color: theme.colors.primary[8],
  },
}));

export function NavChatHistoryEntry({
  chat,
  editChatHistory,
  setEditingChat,
}: {
  chat: Chat;
  editChatHistory: boolean;
  setEditingChat: (chat: Chat) => void;
}) {
  const { classes, cx, theme } = useStyles();

  const isSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const activeChatId = router.query.chatId as string | undefined;

  return (
    <li className={classes.listItem}>
      <Link
        key={chat.id}
        href={`/chat/${chat.id}`}
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
          {editChatHistory && (
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
              <IconX className={classes.icon} />
            </ActionIcon>
          )}

          <Text className={classes.chatLinkText}>
            {chat.title || "Untitled"}
          </Text>

          {editChatHistory && (
            <ActionIcon
              variant="subtle"
              size={isSmall ? 40 : 15}
              onClick={(event) => {
                event.preventDefault();
                setEditingChat(chat);
              }}
            >
              <IconPencil className={classes.icon} />
            </ActionIcon>
          )}
        </Flex>
      </Link>
    </li>
  );
}
