import { Chat } from "@/stores/Chat";

type ChatGroupBase = {
  deltaDays: number;
  label: string;
};

type ChatGroup = ChatGroupBase & {
  chats: Chat[];
};

/**
 * Groups an array of chats by date, based on a given set of date groups.
 *
 * @param {Chat[]} chats - The array of chats to group.
 * @param {ChatGroupBase[]} dateGroups - The array of date groups to assign chats to..
 * @return {ChatGroup[]} An array of chat groups, each containing an array of chats.
 */
export default function groupChatsByDate(
  chats: Chat[],
  dateGroups: ChatGroupBase[]
) {
  const sortedChats = [...chats].sort(
    (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
  );

  const chatDateGroups: ChatGroup[] = dateGroups.map((group) => ({
    ...group,
    chats: [],
  }));

  const now = new Date();

  for (const chat of sortedChats) {
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

export const defaultDateGroups: ChatGroupBase[] = [
  { deltaDays: 0, label: "Today" },
  { deltaDays: 1, label: "Yesterday" },
  { deltaDays: 7, label: "Last week" },
  { deltaDays: 30, label: "Last month" },
  { deltaDays: 365, label: "Last year" },
];
