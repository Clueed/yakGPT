import { Chat } from "@/stores/Chat";
import { updateChat } from "@/stores/ChatActions";
import { ActionIcon, Modal, TextInput, px } from "@mantine/core";
import { useFocusTrap } from "@mantine/hooks";
import { IconArrowRight } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export function EditTitleModal({
  editingChat,
  setEditingChat,
}: {
  editingChat: Chat | undefined;
  setEditingChat: (chat: Chat | undefined) => void;
}) {
  const [editedTitle, setEditedTitle] = useState<string>("");

  useEffect(() => {
    setEditedTitle(editingChat?.title?.trim() || "");
  }, [editingChat]);

  const submitEditedTitle = () => {
    if (editedTitle) {
      updateChat({ id: editingChat?.id, title: editedTitle });
    }
    setEditingChat(undefined);
  };

  const focusTrapRef = useFocusTrap();

  return (
    <Modal
      opened={editingChat !== undefined}
      onClose={() => setEditingChat(undefined)}
      title="Edit Chat Title"
    >
      <TextInput
        ref={focusTrapRef}
        data-autofocus
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            submitEditedTitle();
          }
        }}
        rightSection={
          <ActionIcon onClick={() => submitEditedTitle()}>
            <IconArrowRight size={px("1.2rem")} stroke={1.5} />
          </ActionIcon>
        }
      />
    </Modal>
  );
}
