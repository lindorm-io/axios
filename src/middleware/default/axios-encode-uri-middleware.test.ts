import { axiosEncodeUriMiddleware } from "./axios-encode-uri-middleware";

describe("axiosEncodeUriMiddleware", () => {
  let middleware: any;

  beforeEach(() => {
    middleware = axiosEncodeUriMiddleware;
  });

  test("should convert all query values to URI component", async () => {
    await expect(
      middleware.request({
        params: {
          params1: "paramsValue",
          params2: 12345,
          params3: "params with spaces",
          params4: "https://test.lindorm.io/route/",
          params5: "+4670123456789",
        },
        query: {
          query1: "queryValue",
          query2: 12345,
          query3: "query with spaces",
          query4: "https://test.lindorm.io/route/",
          query5: "+4670123456789",
        },
      }),
    ).resolves.toStrictEqual({
      params: {
        params1: "paramsValue",
        params2: "12345",
        params3: "params%20with%20spaces",
        params4: "https%3A%2F%2Ftest.lindorm.io%2Froute%2F",
        params5: "%2B4670123456789",
      },
      query: {
        query1: "queryValue",
        query2: "12345",
        query3: "query%20with%20spaces",
        query4: "https%3A%2F%2Ftest.lindorm.io%2Froute%2F",
        query5: "%2B4670123456789",
      },
    });
  });
});
