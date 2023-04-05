import { rest } from "msw";
import modelsJSON from "./models.json";
import incorrectApiKeyJSON from "./incorrentApiKey.json";
import chatCompletionString from "./ChatCompletionMock";
import { endsWith } from "lodash";
import OpenAiApiErrors from "./openAiApiErrors";

export const handlers = [
  rest.get("https://api.openai.com/v1/models", (req, res, ctx) => {
    const headerAuthorization = req.headers.get("authorization");

    if (headerAuthorization?.slice(-1).toLowerCase() === "e") {
      return res(ctx.status(401), ctx.json(incorrectApiKeyJSON));
    } else {
      return res(ctx.status(200), ctx.json(modelsJSON));
    }
  }),
  rest.post(
    "https://api.openai.com/v1/chat/completions",
    async (req, res, ctx) => {
      const pageParams = new URLSearchParams(window.location.search);
      const scenario = pageParams.get("scenario");
      console.log(scenario);

      const lastMessage = await req
        .json()
        .then((req) => req.messages.at(-1).content.toLowerCase());

      for (let error of OpenAiApiErrors) {
        if (endsWith(lastMessage, error.errorString)) {
          return res(
            ctx.status(error.statusCode),
            ctx.body(error.errorMessage)
          );
        }
      }

      return res(ctx.status(200), ctx.body(chatCompletionString));
    }
  ),
  rest.post(
    "https://api.openai.com/v1/audio/transcriptions",
    async (req, res, ctx) => {
      const pageParams = new URLSearchParams(window.location.search);
      const scenario = pageParams.get("scenario");
      console.log(scenario);

      for (let error of OpenAiApiErrors) {
        if (scenario === "whisper-" + error.errorString) {
          return res(
            ctx.status(error.statusCode),
            ctx.body(error.errorMessage)
          );
        }
      }

      return res(ctx.status(200), ctx.json({ text: "hello_test" }));
    }
  ),
];
