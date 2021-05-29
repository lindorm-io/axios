import axios from "axios";
import { Axios } from "./Axios";
import { logger } from "../test";
import { AuthType } from "../enum";

jest.mock("axios");

describe("Axios", () => {
  let handler: Axios;

  beforeEach(() => {
    handler = new Axios({
      auth: {
        basic: { username: "username", password: "password" },
        bearer: "bearerAuth",
      },
      baseUrl: "http://localhost",
      logger,
    });
  });

  afterEach(jest.clearAllMocks);

  test("should GET", async () => {
    await expect(handler.get("/get/path", { params: { param1: true } })).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });

  test("should POST", async () => {
    await expect(handler.post("/post/path", { data: { data: true } })).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });

  test("should PUT", async () => {
    await expect(handler.put("/put/path", { data: { data: true } })).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });

  test("should PATCH", async () => {
    await expect(handler.patch("/patch/path", { data: { data: true } })).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });

  test("should DELETE", async () => {
    await expect(handler.delete("/delete/path")).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });

  test("should use basic auth", async () => {
    await expect(handler.get("/get/path", { auth: AuthType.BASIC })).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });

  test("should use bearer auth", async () => {
    await expect(handler.get("/get/path", { auth: AuthType.BEARER, headers: {} })).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });

  test("should overwrite bearer auth if specified in headers or middleware", async () => {
    await expect(
      handler.get("/get/path", { auth: AuthType.BEARER, headers: { Authorization: "custom" } }),
    ).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });

  test("should not use base url", async () => {
    await expect(handler.get("http://without-base-url/path")).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });

  test("should not use base url when specified", async () => {
    handler = new Axios({
      // @ts-ignore
      logger,
    });
    await expect(handler.get("http://without-base-url/path")).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });
});
