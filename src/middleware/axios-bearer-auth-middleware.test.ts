import { axiosBearerAuthMiddleware } from "./axios-bearer-auth-middleware";

describe("axiosBearerAuthMiddleware", () => {
  let middleware: any;

  beforeEach(() => {
    middleware = axiosBearerAuthMiddleware("jwt.jwt.jwt");
  });

  test("should convert all data keys to snake_case", () => {
    expect(
      middleware.request({
        data: { data: true },
        headers: { headers: true },
        params: { params: true },
      }),
    ).resolves.toMatchSnapshot();
  });
});
