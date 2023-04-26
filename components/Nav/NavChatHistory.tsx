import { useChatStore } from "@/stores/ChatStore";
import { Box, Flex, Text, createStyles } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import ChatHistoryEditButton from "./ChatHistoryEditButton";
import { EditTitleModal } from "./EditTitleModal";
import { NavChatHistoryEntry } from "./NavChatHistoryEntry";
import groupChatsByDate, { defaultDateGroups } from "./groupChatsByDate";
import { Chat } from "@/stores/Chat";

const useStyles = createStyles((theme) => ({
  chatHistoryContainer: {
    overflowY: "scroll",
    maskImage: "linear-gradient(to bottom, black 95%, transparent 100%)",
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
    color: theme.colors.primary[4],
    paddingBottom: theme.spacing.xxxs,

    [theme.fn.smallerThan("sm")]: {
      fontSize: theme.fontSizes.xl,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.xxs,
    },
  },
}));

export function NavChatHistory() {
  const { classes, theme } = useStyles();

  const chats = useChatStore((state) => state.chats);
  const groupedChats = groupChatsByDate(chats, defaultDateGroups);

  const [editChatsHistory, setEditChatsHistory] = useState(false);
  const [editingChat, setEditingChat] = useState<Chat | undefined>(undefined);

  if (chats.length === 0) {
    return null;
  }

  return (
    <>
      <Flex
        direction={"column"}
        sx={{
          maxHeight: "100%",
          borderRadius: theme.spacing.xxs,
          overflow: "hidden",
        }}
        bg={theme.colors.primary[0]}
      >
        <Box className={classes.chatHistoryContainer}>
          <ul className={classes.list}>
            {groupedChats.map((group) => (
              <li key={group.deltaDays} className={classes.listItem}>
                <Text className={classes.groupLabel}>{group.label}</Text>
                <ul className={classes.list}>
                  {group.chats.map((chat) => (
                    <NavChatHistoryEntry
                      key={chat.id}
                      chat={chat}
                      editChatHistory={editChatsHistory}
                      setEditingChat={setEditingChat}
                    />
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Box>

        <ChatHistoryEditButton
          setEditMode={setEditChatsHistory}
          editMode={editChatsHistory}
        />
      </Flex>
      <EditTitleModal
        editingChat={editingChat}
        setEditingChat={setEditingChat}
      />
    </>
  );
}
