import { faker } from "@faker-js/faker";
import { Chat } from "@/stores/Chat";
import { Message } from "@/stores/Message";
import { v4 as uuidv4 } from "uuid";

export function generateFakeChats(chatsCount: number): Chat[] {
  const chats: Chat[] = [];

  for (let i = 0; i < chatsCount; i++) {
    const id = uuidv4();
    const title = faker.lorem.words(3);
    const createdAt = faker.date.past();

    const content = (): string => {
      return faker.lorem.paragraphs(Math.floor(Math.random() * 5));
    };

    const messages: Message[] = [
      {
        id: uuidv4(),
        content: content(),
        role: "system",
      },
      {
        id: uuidv4(),
        content: content(),
        role: "assistant",
      },
      {
        id: uuidv4(),
        content: content(),
        role: "user",
      },
      {
        id: uuidv4(),
        content: content(),
        role: "assistant",
      },
      {
        id: uuidv4(),
        content: content(),
        role: "user",
      },
    ];

    chats.push({
      id,
      title,
      createdAt,
      messages,
    });
  }

  return chats;
}
