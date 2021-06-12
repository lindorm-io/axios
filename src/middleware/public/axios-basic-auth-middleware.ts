import { AxiosBasicCredentials } from "axios";
import { AxiosMiddleware, RequestConfig } from "../../typing";

export const axiosBasicAuthMiddleware = (credentials: AxiosBasicCredentials): AxiosMiddleware => ({
  config: async (config): Promise<RequestConfig> => ({
    ...config,
    auth: credentials,
  }),
});
