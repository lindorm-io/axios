import axios from "axios";
import { Axios } from "./Axios";
import { logger } from "../test";

jest.mock("axios");

describe("Axios", () => {
  let handler: Axios;

  beforeEach(() => {
    handler = new Axios({
      baseUrl: "http://localhost",
      // @ts-ignore
      logger,
    });
  });

  afterEach(jest.clearAllMocks);

  test("should GET", async () => {
    await expect(handler.get("http://localhost/get/path", { params: { param1: true } })).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });

  test("should POST", async () => {
    await expect(handler.post("http://localhost/post/path", { data: true })).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });

  test("should PUT", async () => {
    await expect(handler.put("http://localhost/put/path", { data: true })).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });

  test("should PATCH", async () => {
    await expect(handler.patch("http://localhost/patch/path", { data: true })).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });

  test("should DELETE", async () => {
    await expect(handler.delete("http://localhost/delete/path")).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });

  test("should use basic auth", async () => {
    handler = new Axios({
      basicAuth: { username: "username", password: "password" },
      // @ts-ignore
      logger,
    });
    await expect(handler.get("http://localhost/get/path")).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });

  test("should use and prioritize bearer auth", async () => {
    handler = new Axios({
      bearerAuth: "bearerAuth",
      basicAuth: { username: "username", password: "password" },
      // @ts-ignore
      logger,
    });
    await expect(handler.get("http://localhost/get/path")).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });

  test("should use base url", async () => {
    handler = new Axios({
      baseUrl: "http://localhost",
      // @ts-ignore
      logger,
    });
    await expect(handler.get("/get/path")).resolves.toMatchSnapshot();
    // @ts-ignore
    expect(axios.request.mock.calls).toMatchSnapshot();
  });
});
