import { IAxiosRequest } from "../typing";

export const axiosBearerAuthMiddleware = (bearerToken: string) => ({
  request: async (request: IAxiosRequest): Promise<IAxiosRequest> => ({
    ...request,
    headers: {
      ...request.headers,
      Authorization: `Bearer ${bearerToken}`,
    },
  }),
});
