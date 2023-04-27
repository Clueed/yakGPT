import {
  Avatar,
  Box,
  CopyButton,
  createStyles,
  Flex,
  getStylesRef,
  MantineTheme,
  Tooltip,
} from "@mantine/core";

import {
  IconCheck,
  IconCopy,
  IconRepeat,
  IconRobot,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import MessageDisplay from "./ChatMessageContent";

import { Message } from "@/stores/Message";
import {
  regenerateAssistantMessage,
  setEditingMessage,
  delMessage,
} from "@/stores/ChatActions";
import { IconPencil } from "@tabler/icons-react";
import { IconX } from "@tabler/icons-react";

const useStyles = createStyles((theme: MantineTheme) => ({
  messageContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",

    gridColumn: 3,

    borderRadius: theme.radius.sm,
    overflow: "hidden",
    maxWidth: "100%",

    [`&:hover .${getStylesRef("button")}`]: {
      opacity: 1,
    },
  },

  userBg: {
    backgroundColor: theme.colors.primary[0],
  },
  botBg: {
    backgroundColor: theme.colors.primary[1],
  },

  actionIcon: {
    ref: getStylesRef("button"),

    opacity: 1,
  },

  toolBarIcon: {
    height: "1rem",
    width: "1rem",
    color: theme.colors.primary[3],
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      color: theme.colors.primary[9],
      transform: "scale(1.1)",
    },
  },

  avatarIcon: {
    height: "1rem",
    width: "1rem",
    color: theme.colors.primary[3],
  },
}));

export default function ChatMessage({ message }: { message: Message }) {
  const { classes, cx } = useStyles();

  return (
    <>
      {["system", "assistant"].includes(message.role) && (
        <Avatar radius="md" size="sm" color="primary.1" sx={{ gridColumn: 2 }}>
          {message.role === "system" ? (
            <IconSettings className={classes.avatarIcon} />
          ) : (
            <IconRobot className={classes.avatarIcon} />
          )}
        </Avatar>
      )}
      <div
        className={cx(
          classes.messageContainer,
          message.role === "user" ? classes.userBg : classes.botBg
        )}
      >
        <MessageDisplay message={message} />
      </div>
      {message.role === "user" && (
        <Avatar
          radius="md"
          size="sm"
          color="primary.0"
          sx={{ gridColumn: 4 }}
          className={classes.userBg}
        >
          <IconUser className={classes.avatarIcon} />
        </Avatar>
      )}
    </>
  );
}
