import { rest } from "msw";
import modelsJSON from "./models.json";
import incorrectApiKeyJSON from "./incorrentApiKey.json";
import chatCompletionString from "./ChatCompletionMock";
import OpenAiApiErrors from "./openAiApiErrors";

function handleOpenAiApiRequest(
  res,
  ctx,
  paramPrefix: string,
  defaultResponse
) {
  const pageParams = new URLSearchParams(window.location.search);
  const errorParams = pageParams.getAll("error");

  if (errorParams.length === 0) {
    return res(ctx.status(200), defaultResponse);
  }

  const errorParamsList = errorParams[0].split(",");

  const matchingError = OpenAiApiErrors.find((error) => {
    return errorParamsList.includes(
      `${paramPrefix.toLowerCase()}-${error.errorString}`
    );
  });

  if (matchingError) {
    const { statusCode, errorMessage } = matchingError;
    return res(
      ctx.status(statusCode),
      ctx.json({
        error: {
          message: errorMessage,
          // Not used in API implementation but part of every error response
          // values not public
          // type: "invalid_request_error",
          // param: null,
          // code: "invalid_api_key",
        },
      })
    );
  }
}

export const handlers = [
  rest.get("https://api.openai.com/v1/models", (req, res, ctx) => {
    return handleOpenAiApiRequest(res, ctx, "openAIKey", ctx.json(modelsJSON));
  }),
  rest.post(
    "https://api.openai.com/v1/chat/completions",
    async (req, res, ctx) => {
      return handleOpenAiApiRequest(
        res,
        ctx,
        "comp",
        ctx.body(chatCompletionString)
      );
    }
  ),
  rest.post(
    "https://api.openai.com/v1/audio/transcriptions",
    async (req, res, ctx) => {
      return handleOpenAiApiRequest(
        res,
        ctx,
        "whisper",
        ctx.json({ text: "hello_test" })
      );
    }
  ),
];
