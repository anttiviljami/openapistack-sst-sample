import { ApiHandler } from "sst/node/api";

import { definition } from "@openapistack-sst-sample/core";

import { OpenAPIBackend, type Request } from "openapi-backend";
import { type APIGatewayProxyEventV2 } from "aws-lambda";

const headers = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
};

const api = new OpenAPIBackend({ definition, quick: true });

api.register({
  notFound: async (c, event: APIGatewayProxyEventV2) => ({
    statusCode: 404,
    body: JSON.stringify({ err: "not found" }),
    headers,
  }),
  validationFail: async (c, event: APIGatewayProxyEventV2) => ({
    statusCode: 400,
    body: JSON.stringify({ err: c.validation.errors }),
    headers,
  }),
  notImplemented: async (c, event: APIGatewayProxyEventV2) => {
    const { status, mock } = c.api.mockResponseForOperation(
      c.operation.operationId as string
    );
    return {
      statusCode: status,
      body: JSON.stringify(mock),
      headers,
    };
  },
});

// init api
api.init();

export const handler = ApiHandler(async (event, context) => {
  if (event.rawPath === "/openapi.json") {
    return {
      statusCode: 200,
      body: JSON.stringify(definition),
      headers,
    };
  }

  return await api.handleRequest(
    {
      method: event.requestContext.http.method,
      path: event.rawPath,
      query: event.rawQueryString,
      body: event.body,
      headers: event.headers as Request["headers"],
    },
    event,
    context
  );
});
