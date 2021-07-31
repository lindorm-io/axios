import axios from "axios";
import { Axios } from "./Axios";
import { logger } from "../test";
import { AuthType } from "../enum";
import { axiosBasicAuthMiddleware, axiosBearerAuthMiddleware } from "../middleware/public";
import { AxiosRequestError } from "../error";

jest.mock("axios");

const request = axios.request as jest.Mock;

const mocked = {
  data: {},
  headers: {},
  status: 200,
  statusText: "OK",
};

describe("Axios", () => {
  let handler: Axios;

  beforeEach(() => {
    handler = new Axios({
      baseUrl: "http://localhost",
      logger,
      middleware: [
        axiosBasicAuthMiddleware({ username: "user", password: "pass" }),
        axiosBearerAuthMiddleware("jwt.jwt.jwt"),
      ],
    });

    request.mockResolvedValue({
      status: 200,
      statusText: "OK",
    });
  });

  afterEach(jest.clearAllMocks);

  test("should GET", async () => {
    await expect(handler.get("/get/path")).resolves.toStrictEqual(mocked);

    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should POST", async () => {
    await expect(handler.post("/post/path")).resolves.toStrictEqual(mocked);

    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should PUT", async () => {
    await expect(handler.put("/put/path")).resolves.toStrictEqual(mocked);

    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should PATCH", async () => {
    await expect(handler.patch("/patch/path")).resolves.toStrictEqual(mocked);

    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should DELETE", async () => {
    await expect(handler.delete("/delete/path")).resolves.toStrictEqual(mocked);

    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should use basic auth when specified", async () => {
    await expect(
      handler.get("/get/path", {
        auth: AuthType.BASIC,
        middleware: [axiosBasicAuthMiddleware({ username: "user", password: "pass" })],
      }),
    ).resolves.toStrictEqual(mocked);

    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should retry with set options", async () => {
    request.mockRejectedValue({ statusCode: 500 });

    await expect(
      handler.get("/get/path", {
        retry: 3,
      }),
    ).rejects.toThrow(AxiosRequestError);

    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should retry once with default options", async () => {
    request.mockRejectedValue({ statusCode: 500 });

    await expect(handler.get("/get/path")).rejects.toThrow(AxiosRequestError);

    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should use bearer auth when specified", async () => {
    await expect(handler.get("/get/path", { auth: AuthType.BEARER })).resolves.toStrictEqual(mocked);

    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should use data as specified", async () => {
    await expect(handler.get("/get/path", { data: { data1: "value" } })).resolves.toStrictEqual(mocked);

    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should use headers as specified", async () => {
    await expect(handler.get("/get/path", { headers: { "X-Header": "Value" } })).resolves.toStrictEqual(mocked);

    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should use params as specified", async () => {
    await expect(handler.get("/get/path/:param1", { params: { param1: "paramValue" } })).resolves.toStrictEqual(mocked);

    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should use query as specified", async () => {
    await expect(
      handler.get("/get/path/query", {
        query: {
          query1: "queryValue",
          query2: 12345,
          query3: "query with spaces",
          query4: "https://test.lindorm.io/route/",
        },
      }),
    ).resolves.toStrictEqual(mocked);

    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should not use base url", async () => {
    await expect(handler.get("http://without-base-url/path")).resolves.toStrictEqual(mocked);

    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should not use base url when specified", async () => {
    handler = new Axios({ logger });

    await expect(handler.get("http://without-base-url/path")).resolves.toStrictEqual(mocked);

    expect(request.mock.calls).toMatchSnapshot();
  });
});
