import {
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
import MessageDisplay from "../MessageDisplay";

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

    //paddingTop: theme.spacing.sm,
    //paddingBottom: theme.spacing.sm,
    //paddingLeft: theme.spacing.sm,
    //paddingRight: theme.spacing.sm,

    fontSize: theme.fontSizes.sm,
    borderRadius: theme.radius.sm,
    overflow: "hidden",
    maxWidth: "100%",

    [`&:hover .${getStylesRef("button")}`]: {
      opacity: 1,
    },
  },

  userMessageContainer: {
    backgroundColor: theme.colors.primary[0],
  },
  botMessageContainer: {
    backgroundColor: theme.colors.primary[1],
  },

  actionIcon: {
    ref: getStylesRef("button"),

    opacity: 1,
  },

  toolBarIcon: {
    height: "1rem",
    width: "1rem",
    color: theme.colors.primary[5],
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      color: theme.colors.primary[9],
      transform: "scale(1.1)",
    },
  },

  avatarIcon: {
    height: "1rem",
    width: "1rem",
    color: theme.colors.primary[4],
  },

  messageContent: {
    fontSize: theme.fontSizes.sm,
    wordWrap: "break-word",
    display: "block",
    width: "60ch",
    lineHeight: 1.5,
    color: theme.colors.primary[9],
    //paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
  },
}));

export default function ChatDisplay({ message }: { message: Message }) {
  const { classes, cx } = useStyles();

  return (
    <div
      key={message.id}
      className={cx(
        classes.messageContainer,
        message.role === "user"
          ? classes.userMessageContainer
          : classes.botMessageContainer
      )}
    >
      <Flex
        direction={"row"}
        justify="space-between"
        w="100%"
        pt="xxs"
        px="xs"
        align="center"
      >
        {
          //<Avatar size="sm" radius="md" my="xxs" mr="xs" variant="light">
        }
        <Box sx={{ flex: 1 }}>
          <CopyButton value={message.content}>
            {({ copied, copy }) =>
              copied ? (
                <IconCheck className={classes.toolBarIcon} />
              ) : (
                <IconCopy className={classes.toolBarIcon} onClick={copy} />
              )
            }
          </CopyButton>
        </Box>
        <Box sx={{ flex: 1, textAlign: "center" }}>
          {message.role === "system" ? (
            <IconSettings className={classes.avatarIcon} />
          ) : message.role === "assistant" ? (
            <IconRobot className={classes.avatarIcon} />
          ) : (
            <IconUser className={classes.avatarIcon} />
          )}
        </Box>
        {
          //</Avatar>
        }
        <Flex gap="xs" justify="end" sx={{ flex: 1 }}>
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
      <div className={classes.messageContent}>
        <MessageDisplay message={message} />
      </div>
    </div>
  );
}
