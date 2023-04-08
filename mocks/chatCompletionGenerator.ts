export function chatCompletionStreamGenerator(inputString: string): string {
  const messageTemplate = {
    id: "chatcmpl-71dSFXTxu7ZhNxKU3RPKg1w03vSaB",
    object: "chat.completion.chunk",
    created: Date.now(),
    model: "gpt-3.5-turbo-0301",
    choices: [] as any[], // Using a generic array to allow any type for delta
  };

  const words = inputString.split(/(\s+)/g);
  const messages = words.map((word) => ({
    ...messageTemplate,
    choices: [{ delta: { content: word }, index: 0, finish_reason: null }],
  }));

  return (
    [
      {
        ...messageTemplate,
        choices: [
          { delta: { role: "assistant" }, index: 0, finish_reason: null },
        ],
      },
      ...messages,
      {
        ...messageTemplate,
        choices: [{ delta: {}, index: 0, finish_reason: "stop" }],
      },
    ]
      .map((message) => `DATA: ${JSON.stringify(message)}\n\n`)
      .join("") + "DATA: [DONE]"
  );
}
