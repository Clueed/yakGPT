// @ts-ignore

import { rest } from "msw";
import modelsJSON from "./models.json";
import { chatCompletionStreamGenerator } from "./chatCompletionGenerator";
import OpenAiApiErrors from "./openAiApiErrors";
import { faker } from "@faker-js/faker";

function handleOpenAiApiRequest(
  res,
  ctx,
  paramPrefix,
  defaultResponse
) {
  const pageParams = new URLSearchParams(window.location.search);
  const errorParams = pageParams.getAll("error");

  if (errorParams.length !== 0) {
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
            // Not used in implementation but part of every error response.
            // Could not find documentation.
            // type: "invalid_request_error",
            // param: null,
            // code: "invalid_api_key",
          },
        })
      );
    }
  }

  return res(ctx.status(200), defaultResponse);
}

export const handlers = [
  rest.get("https://api.openai.com/v1/models", (req, res, ctx) => {
    return handleOpenAiApiRequest(res, ctx, "openAIKey", ctx.json(modelsJSON));
  }),
  rest.post("https://api.openai.com/v1/chat/completions", (req, res, ctx) => {
    return handleOpenAiApiRequest(
      res,
      ctx,
      "comp",
      ctx.body(
        chatCompletionStreamGenerator(
          faker.lorem.paragraphs(Math.floor(Math.random() * 5))
        )
      )
    );
  }),
  rest.post(
    "https://api.openai.com/v1/audio/transcriptions",
    (req, res, ctx) => {
      console.log("req :>> ");
      return handleOpenAiApiRequest(
        res,
        ctx,
        "whisper",
        ctx.json({
          text: faker.lorem.paragraphs(Math.floor(Math.random() * 5)),
        })
      );
    }
  ),
];
