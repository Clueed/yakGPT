import {
  ActionIcon,
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
    overflow: "hidden",

    gridColumn: 3,

    borderRadius: theme.radius.sm,

    [`&.${getStylesRef("system")}`]: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary[6],
      textAlign: "center",
    },
    [`&.${getStylesRef("user")}`]: {
      backgroundColor: theme.colors.primary[0],
      color: theme.colors.primary[8],
    },
    [`&.${getStylesRef("assistant")}`]: {
      backgroundColor: theme.colors.primary[1],
      color: theme.colors.primary[9],
    },

    [`&:hover .${getStylesRef("toolBar")}`]: {
      opacity: 1,
    },
  },

  system: {
    ref: getStylesRef("system"),
  },
  user: {
    ref: getStylesRef("user"),
  },
  assistant: {
    ref: getStylesRef("assistant"),
  },

  toolBar: {
    ref: getStylesRef("toolBar"),
    position: "absolute",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    background: `linear-gradient(to bottom, ${
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.light[1]
    }E6 50%, #FFFFFF00 100%)`,

    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.light[7],

    opacity: 0,
    transition: "opacity 0.2s ease-in-out",

    padding: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: `calc(${theme.spacing.xxl} * 2)`,
  },

  toolBarIcon: {
    height: "1.1rem",
    width: "1.1rem",

    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      color: theme.colors.primary[9],
      transform: "scale(1.1)",
    },
  },

  avatarIcon: {
    height: "1.1rem",
    width: "1.1rem",
    color: theme.colors.primary[3],
  },
}));

export default function ChatMessage({ message }: { message: Message }) {
  const { classes, cx } = useStyles();

  if (message.role === "system") {
    return (
      <div className={cx(classes.messageContainer, classes.system)}>
        <MessageDisplay message={message} />
      </div>
    );
  }

  return (
    <>
      {message.role === "assistant" && (
        <Avatar radius="sm" size="sm" color="primary.1" sx={{ gridColumn: 2 }}>
          <IconRobot className={classes.avatarIcon} />
        </Avatar>
      )}
      <div
        className={cx(
          classes.messageContainer,
          message.role === "user" && classes.user,
          message.role === "assistant" && classes.assistant
        )}
      >
        <div style={{ position: "relative", width: "100%" }}>
          <Flex className={classes.toolBar}>
            <CopyButton value={message.content}>
              {({ copied, copy }) =>
                copied ? (
                  <IconCheck className={classes.toolBarIcon} />
                ) : (
                  <IconCopy className={classes.toolBarIcon} onClick={copy} />
                )
              }
            </CopyButton>

            <Flex gap="md" justify="end">
              {message.role === "assistant" ? (
                <Tooltip label="Resubmit" withArrow>
                  <IconRepeat
                    className={classes.toolBarIcon}
                    onClick={() => regenerateAssistantMessage(message)}
                  />
                </Tooltip>
              ) : (
                <Tooltip label="Edit & submit" withArrow>
                  <IconPencil
                    className={classes.toolBarIcon}
                    onClick={() => setEditingMessage(message)}
                  />
                </Tooltip>
              )}

              <Tooltip label="Delete message" withArrow>
                <IconX
                  className={classes.toolBarIcon}
                  onClick={() => delMessage(message)}
                />
              </Tooltip>
            </Flex>
          </Flex>
        </div>
        <MessageDisplay message={message} />
      </div>
      {message.role === "user" && (
        <Avatar
          radius="md"
          size="sm"
          color="primary.0"
          sx={{ gridColumn: 4 }}
          className={classes.user}
        >
          <IconUser className={classes.avatarIcon} />
        </Avatar>
      )}
    </>
  );
}
