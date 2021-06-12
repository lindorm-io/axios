import { AxiosMiddleware, AxiosRequest } from "../../typing";

export const axiosBearerAuthMiddleware = (bearerToken: string): AxiosMiddleware => ({
  request: async (request): Promise<AxiosRequest> => ({
    ...request,
    headers: {
      ...(request.headers || {}),
      Authorization: `Bearer ${bearerToken}`,
    },
  }),
});
