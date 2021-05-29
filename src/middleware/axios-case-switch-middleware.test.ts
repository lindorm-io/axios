import { axiosCaseSwitchMiddleware } from "./axios-case-switch-middleware";

describe("axiosCaseSwitchMiddleware", () => {
  let middleware: any;

  beforeEach(() => {
    middleware = axiosCaseSwitchMiddleware;
  });

  test("should convert all data keys to snake_case", () => {
    expect(
      middleware.request({
        data: {
          camelCase1: 1,
          camelCase2: 2,
          camelCase3: { camelCase4: 4 },
        },
        headers: { headers: true },
        params: { params: true },
      }),
    ).resolves.toMatchSnapshot();
  });

  test("should convert all data keys to camelCase", () => {
    expect(
      middleware.response({
        data: {
          snake_case_1: 1,
          snake_case_2: 2,
          snake_case_3: { snake_case_4: 4 },
        },
        headers: {},
        status: 200,
        statusText: "OK",
      }),
    ).resolves.toMatchSnapshot();
  });
});
