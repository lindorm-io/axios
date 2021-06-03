import { AxiosMiddleware } from "../../typing";
import { camelKeys, snakeKeys } from "@lindorm-io/core";

export const axiosCaseSwitchMiddleware: AxiosMiddleware = {
  request: async (request) => ({
    ...request,
    data: request.data ? snakeKeys(request.data) : undefined,
  }),
  response: async (response) => ({
    ...response,
    data: response.data ? camelKeys(response.data) : {},
  }),
};
