import { IAxiosRequest, IAxiosResponse } from "../typing";
import { camelKeys, snakeKeys } from "@lindorm-io/core";

export const axiosCaseSwitchMiddleware = {
  request: async (request: IAxiosRequest): Promise<IAxiosRequest> => ({
    ...request,
    data: snakeKeys(request.data),
  }),
  response: async (response: IAxiosResponse): Promise<IAxiosResponse> => ({
    ...response,
    data: camelKeys(response.data),
  }),
};
