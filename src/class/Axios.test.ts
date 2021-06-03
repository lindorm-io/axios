import axios from "axios";
import { Axios } from "./Axios";
import { logger } from "../test";

jest.mock("axios");

const request = axios.request as jest.Mock;

const mocked = {
  data: {},
  headers: {},
  status: undefined,
  statusText: undefined,
};

describe("Axios", () => {
  let handler: Axios;

  beforeEach(() => {
    handler = new Axios({
      baseUrl: "http://localhost",
      logger,
    });
  });

  afterEach(jest.clearAllMocks);

  test("should GET", async () => {
    await expect(handler.get("/get/path", { params: { param1: true } })).resolves.toStrictEqual(mocked);
    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should POST", async () => {
    await expect(handler.post("/post/path", { data: { data: true } })).resolves.toStrictEqual(mocked);
    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should PUT", async () => {
    await expect(handler.put("/put/path", { data: { data: true } })).resolves.toStrictEqual(mocked);
    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should PATCH", async () => {
    await expect(handler.patch("/patch/path", { data: { data: true } })).resolves.toStrictEqual(mocked);
    expect(request.mock.calls).toMatchSnapshot();
  });

  test("should DELETE", async () => {
    await expect(handler.delete("/delete/path")).resolves.toStrictEqual(mocked);
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
