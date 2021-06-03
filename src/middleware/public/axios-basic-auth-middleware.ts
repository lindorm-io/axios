import { AxiosBasicCredentials } from "axios";
import { AxiosMiddleware } from "../../typing";

export const axiosBasicAuthMiddleware = (credentials: AxiosBasicCredentials): AxiosMiddleware => ({
  config: async (config) => ({
    ...config,
    auth: credentials,
  }),
});
