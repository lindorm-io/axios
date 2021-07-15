import { AxiosMiddleware, AxiosRequest } from "../../typing";
import { isObjectStrict } from "@lindorm-io/core";

export const axiosEncodeQueryMiddleware: AxiosMiddleware = {
  request: async (request): Promise<AxiosRequest> => {
    const { query } = request;

    if (isObjectStrict(query)) {
      for (const [key, value] of Object.entries(query)) {
        query[key] = encodeURIComponent(value);
      }
    }

    return {
      ...request,
      query,
    };
  },
};
