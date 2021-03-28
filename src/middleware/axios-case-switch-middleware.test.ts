import { axiosRequestSnakeKeysMiddleware, axiosResponseCamelKeysMiddleware } from "./axios-case-switch-middleware";

describe("axiosRequestSnakeKeysMiddleware", () => {
  test("should convert all data keys to snake_case", () => {
    expect(
      axiosRequestSnakeKeysMiddleware.request({
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
});

describe("axiosResponseCamelKeysMiddleware", () => {
  test("should convert all data keys to camelCase", () => {
    expect(
      axiosResponseCamelKeysMiddleware.response({
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
