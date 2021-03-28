import { convertError } from "./convert-error";

describe("convertError", () => {
  test("should resolve a more limited AxiosRequestError", () => {
    const converted = convertError({
      config: {
        timeout: 0,
        url: "url",
        data: { data: true },
        headers: { headers: true },
        params: { params: true },
      },
      request: {
        host: "host",
        method: "method",
        path: "path",
        protocol: "protocol",
      },
      response: {
        data: {
          error: {
            message: "message",
            name: "name",
            details: "details",
            code: "code",
            data: { data: true },
            title: "title",
          },
        },
        headers: { headers: true },
        status: 500,
        statusText: "statusText",
      },
    } as any);

    expect(converted).toMatchSnapshot();

    expect(converted.config).toMatchSnapshot();
    expect(converted.debug).toMatchSnapshot();
    expect(converted.details).toMatchSnapshot();
    expect(converted.errorCode).toMatchSnapshot();
    expect(converted.publicData).toMatchSnapshot();
    expect(converted.request).toMatchSnapshot();
    expect(converted.response).toMatchSnapshot();
    expect(converted.statusCode).toMatchSnapshot();
    expect(converted.title).toMatchSnapshot();
  });
});
