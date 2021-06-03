import { AxiosMiddleware } from "../../typing";

export const axiosBearerAuthMiddleware = (bearerToken: string): AxiosMiddleware => ({
  request: async (request) => ({
    ...request,
    headers: {
      ...(request.headers || {}),
      Authorization: `Bearer ${bearerToken}`,
    },
  }),
});
