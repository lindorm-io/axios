import { AxiosMiddleware, AxiosRequest, AxiosResponse } from "../../typing";
import { camelKeys, snakeKeys } from "@lindorm-io/core";

export const axiosCaseSwitchMiddleware: AxiosMiddleware = {
  request: async (request): Promise<AxiosRequest> => ({
    ...request,
    data: request.data ? snakeKeys(request.data) : undefined,
  }),
  response: async (response): Promise<AxiosResponse<any>> => ({
    ...response,
    data: response.data ? camelKeys(response.data) : {},
  }),
};
