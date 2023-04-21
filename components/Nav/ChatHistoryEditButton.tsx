import { ActionIcon, Button, Tooltip, createStyles } from "@mantine/core";
import {
  IconCheck,
  IconEdit,
  IconEditOff,
  IconTrash,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { clearChats } from "@/stores/ChatActions";
import { useMediaQuery } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({}));

export default function ChatHistoryEditButton({ editMode, setEditMode }) {
  const { theme } = useStyles();
  const isSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const router = useRouter();

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
  }, [editMode]);

  return (
    <>
      {editMode && (
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
            radius={0}
            sx={{
              width: "auto",
              height: "auto",
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
        variant={editMode ? "filled" : "light"}
        color={
          editMode
            ? theme.colorScheme === "dark"
              ? "gray.8"
              : "gray.5"
            : theme.colorScheme === "dark"
            ? "gray.5"
            : "gray.6"
        }
        h="28px"
        compact={!isSmall}
        fullWidth
        size={isSmall ? "md" : "xs"}
        radius={0}
        onClick={() => setEditMode(!editMode)}
        leftIcon={
          editMode ? (
            <IconEditOff size={isSmall ? 25 : 15} />
          ) : (
            <IconEdit size={isSmall ? 25 : 15} />
          )
        }
      >
        {editMode ? "Done editing" : "Edit chat history"}
      </Button>
    </>
  );
}
