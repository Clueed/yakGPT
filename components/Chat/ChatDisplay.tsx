import { useEffect, useState } from "react";
import { createStyles, Flex, MantineTheme } from "@mantine/core";
import { useChatStore } from "@/stores/ChatStore";

import ChatMessage from "./ChatMessage";
import { useRouter } from "next/router";
import { setActiveChatId } from "@/stores/ChatActions";

const useStyles = createStyles((theme: MantineTheme) => ({
  container: {
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    overflow: "scroll",
  },
}));

const ChatDisplay = () => {
  const router = useRouter();
  const activeChatId = router.query.chatId as string | undefined;

  useEffect(() => {
    setActiveChatId(activeChatId as string | undefined);
  }, [activeChatId]);

  const { classes, theme } = useStyles();

  const chats = useChatStore((state) => state.chats);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const lastMessage = activeChat?.messages[activeChat.messages.length - 1];

  const scrolledToBottom = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    // allow inaccuracy by adding some
    return height <= winScroll + 1;
  };

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledToBottom(scrolledToBottom());
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isScrolledToBottom) {
      scrollToBottom();
    }
  }, [isScrolledToBottom, activeChat, lastMessage?.content]);

  const scrollToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  return (
    <div className={classes.container}>
      <Flex direction={"column"} gap="xs" pb={"xs"} align="center">
        {activeChat?.messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </Flex>
    </div>
  );
};

export default ChatDisplay;
