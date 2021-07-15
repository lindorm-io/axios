import { axiosEncodeQueryMiddleware } from "./axios-encode-query-middleware";

describe("axiosEncodeQueryMiddleware", () => {
  let middleware: any;

  beforeEach(() => {
    middleware = axiosEncodeQueryMiddleware;
  });

  test("should convert all query values to URI component", async () => {
    await expect(
      middleware.request({
        query: {
          query1: "queryValue",
          query2: 12345,
          query3: "query with spaces",
          query4: "https://test.lindorm.io/route/",
        },
      }),
    ).resolves.toStrictEqual({
      query: {
        query1: "queryValue",
        query2: "12345",
        query3: "query%20with%20spaces",
        query4: "https%3A%2F%2Ftest.lindorm.io%2Froute%2F",
      },
    });
  });
});
