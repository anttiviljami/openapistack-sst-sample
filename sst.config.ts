import { SSTConfig } from "sst";
import { OpenAPI } from "./stacks/OpenAPIStack";

export default {
  config(_input) {
    return {
      name: "openapistack-sample-mock-app",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(OpenAPI);
  },
} satisfies SSTConfig;
