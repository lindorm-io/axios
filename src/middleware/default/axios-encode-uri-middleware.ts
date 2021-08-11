import { AxiosMiddleware, AxiosRequest } from "../../typing";
import { isObjectStrict } from "@lindorm-io/core";

export const axiosEncodeUriMiddleware: AxiosMiddleware = {
  request: async (request): Promise<AxiosRequest> => {
    const { params, query } = request;

    if (isObjectStrict(params)) {
      for (const [key, value] of Object.entries(params)) {
        params[key] = encodeURIComponent(value);
      }
    }

    if (isObjectStrict(query)) {
      for (const [key, value] of Object.entries(query)) {
        query[key] = encodeURIComponent(value);
      }
    }

    return {
      ...request,
      params,
      query,
    };
  },
};
