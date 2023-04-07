interface errortype {
  errorString: string;
  statusCode: number;
  errorMessage: string;
}

const OpenAiApiErrors: errortype[] = [
  {
    errorString: "e401",
    statusCode: 401,
    errorMessage: "invalid authentication",
  },
  {
    errorString: "e401-1",
    statusCode: 401,
    errorMessage:
      "Incorrect API key provided: sk-vASQl***************************************xAZS. You can find your API key at https://platform.openai.com/account/api-keys.",
  },
  {
    errorString: "e401-2",
    statusCode: 401,
    errorMessage: "You must be a member of an organization to use the API",
  },
  {
    errorString: "e429",
    statusCode: 429,
    errorMessage: "Rate limit reached for requests",
  },
  {
    errorString: "e429-1",
    statusCode: 429,
    errorMessage:
      "You exceeded your current quota, please check your plan and billing details",
  },
  {
    errorString: "e429-2",
    statusCode: 429,
    errorMessage: "The engine is currently overloaded, please try again later",
  },
  {
    errorString: "e500",
    statusCode: 500,
    errorMessage: "The server had an error while processing your request",
  },
];

export default OpenAiApiErrors;
