import { StackContext, Api } from "sst/constructs";

export function OpenAPI({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    routes: {
      "ANY /{proxy+}": "packages/functions/src/lambda.handler",
    },
    customDomain: 'example.openapistack.co',
  });

  stack.addOutputs({
    ApiEndpoint: api.customDomainUrl || api.url,
  });
}
