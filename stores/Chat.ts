import { Message } from "./Message";

export interface Chat {
  id: string;
  title?: string | undefined;
  messages: Message[];
  createdAt: Date;
  chosenCharacter?: string | undefined;
  tokensUsed?: number;
  costIncurred?: number;
}
