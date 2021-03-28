import { IAxiosRequest, IAxiosResponse } from "../typing";
import { camelKeys, snakeKeys } from "@lindorm-io/core";

export const axiosRequestSnakeKeysMiddleware = {
  request: async (request: IAxiosRequest) => ({
    ...request,
    data: snakeKeys(request.data),
  }),
};

export const axiosResponseCamelKeysMiddleware = {
  response: async (response: IAxiosResponse) => ({
    ...response,
    data: camelKeys(response.data),
  }),
};
