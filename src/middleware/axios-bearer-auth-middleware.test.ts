import { axiosBearerAuthMiddleware } from "./axios-bearer-auth-middleware";

describe("axiosBearerAuthMiddleware", () => {
  test("should convert all data keys to snake_case", () => {
    expect(
      axiosBearerAuthMiddleware("jwt.jwt.jwt").request({
        data: { data: true },
        headers: { headers: true },
        params: { params: true },
      }),
    ).resolves.toMatchSnapshot();
  });
});
