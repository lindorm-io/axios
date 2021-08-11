import axios, { AxiosResponse as Response } from "axios";
import { AuthType } from "../enum";
import { IAxiosRequestError } from "../error";
import { Logger } from "@lindorm-io/winston";
import { axiosCaseSwitchMiddleware, axiosEncodeUriMiddleware, axiosRetryMiddleware } from "../middleware/default";
import { convertError, convertResponse, logAxiosError, logAxiosResponse } from "../util";
import { getResponseTime } from "../util/get-response-time";
import { startsWith } from "lodash";
import {
  AxiosMiddleware,
  AxiosOptions,
  AxiosRequest,
  AxiosResponse,
  RequestConfig,
  RequestOptions,
  Unknown,
} from "../typing";

export class Axios {
  private readonly baseUrl: string | null;
  private readonly logger: Logger;
  private readonly middleware: Array<AxiosMiddleware>;
  private readonly name: string | null;

  public constructor(options: AxiosOptions) {
    this.baseUrl = options.baseUrl || null;
    this.logger = options.logger.createChildLogger("Axios");
    this.middleware = options.middleware || [];
    this.name = options.name || null;
  }

  public async get<Data = Unknown>(path: string, options?: RequestOptions): Promise<AxiosResponse<Data>> {
    return this.request<Data>({ method: "get", path }, options || { retry: 1 });
  }

  public async post<Data = Unknown>(path: string, options?: RequestOptions): Promise<AxiosResponse<Data>> {
    return this.request<Data>(
      { method: "post", path },
      {
        ...(options || { retry: 1 }),
      },
    );
  }

  public async put<Data = Unknown>(path: string, options?: RequestOptions): Promise<AxiosResponse<Data>> {
    return this.request<Data>(
      { method: "put", path },
      {
        ...(options || { retry: 1 }),
      },
    );
  }

  public async patch<Data = Unknown>(path: string, options?: RequestOptions): Promise<AxiosResponse<Data>> {
    return this.request<Data>(
      { method: "patch", path },
      {
        ...(options || { retry: 1 }),
      },
    );
  }

  public async delete<Data = Unknown>(path: string, options?: RequestOptions): Promise<AxiosResponse<Data>> {
    return this.request<Data>({ method: "delete", path }, options || { retry: 1 });
  }

  private getUrl(path: string, options: RequestOptions): string {
    if (!this.baseUrl) return path;
    if (startsWith(path, "http")) return path;

    return new URL(this.enhancePath(path, options), this.baseUrl).toString();
  }

  private enhancePath(path: string, options: RequestOptions): string {
    if (!options.params) return path;

    const array: Array<string> = [];

    for (const item of path.split("/")) {
      if (!startsWith(item, ":")) {
        array.push(item);
      } else {
        const param = options.params[item.replace(":", "")];

        if (param) {
          array.push(param);
        } else {
          this.logger.error("invalid path/params combination", {
            path,
            params: options.params,
          });

          array.push(item);
        }
      }
    }

    return array.join("/");
  }

  private async configMiddleware(config: RequestConfig, options: RequestOptions): Promise<RequestConfig> {
    const middleware = [...this.middleware, ...(options.middleware || [])];

    for (const mw of middleware) {
      if (!mw.config) continue;
      config = await mw.config(config);
    }

    return config;
  }

  private async errorMiddleware(error: IAxiosRequestError, options: RequestOptions): Promise<IAxiosRequestError> {
    const middleware = [...this.middleware, ...(options.middleware || [])];

    for (const mw of middleware) {
      if (!mw.error) continue;
      error = await mw.error(error);
    }

    return error;
  }

  private async requestMiddleware(request: AxiosRequest, options: RequestOptions): Promise<AxiosRequest> {
    const middleware = [
      ...this.middleware,
      ...(options.middleware || []),
      axiosCaseSwitchMiddleware,
      axiosEncodeUriMiddleware,
    ];

    for (const mw of middleware) {
      if (!mw.request) continue;
      request = await mw.request(request);
    }

    return request;
  }

  private async responseMiddleware<Data>(
    response: AxiosResponse<Data>,
    options: RequestOptions,
  ): Promise<AxiosResponse<Data>> {
    const middleware = [axiosCaseSwitchMiddleware, ...this.middleware, ...(options.middleware || [])];

    for (const mw of middleware) {
      if (!mw.response) continue;
      response = (await mw.response(response)) as AxiosResponse<Data>;
    }

    return response;
  }

  private async retryMiddleware(error: IAxiosRequestError, options: RequestOptions): Promise<boolean> {
    const middleware = [axiosRetryMiddleware, ...this.middleware, ...(options.middleware || [])];
    let result = false;

    for (const mw of middleware) {
      if (!mw.retry) continue;
      result = await mw.retry(error, options);
    }

    return result;
  }

  private async request<Data>(config: RequestConfig, options: RequestOptions): Promise<AxiosResponse<Data>> {
    const start = Date.now();

    options.retry = options.retry || 0;

    const { auth, method, path } = await this.configMiddleware(config, options);
    const { data, headers, query } = await this.requestMiddleware(
      {
        data: options.data,
        headers: options.headers || {},
        params: options.params,
        query: options.query,
      },
      options,
    );
    const url = this.getUrl(path, options);
    const { Authorization, ...restHeaders } = headers || {};

    let response: Response;

    try {
      response = await axios.request({
        ...(options.auth === AuthType.BASIC ? { auth } : {}),
        method,
        ...(data ? { data } : {}),
        headers: {
          ...(options.auth === AuthType.BEARER ? { Authorization } : {}),
          ...(restHeaders ? restHeaders : {}),
        },
        ...(query ? { params: query } : {}),
        url,
      });

      logAxiosResponse({
        logger: this.logger,
        name: this.name,
        time: getResponseTime(response?.headers, start),
        response,
      });
    } catch (err) {
      logAxiosError({
        logger: this.logger,
        name: this.name,
        time: getResponseTime(err?.response?.headers, start),
        error: err,
      });

      if (await this.retryMiddleware(err, options)) {
        return this.request(config, { ...options, retry: options.retry - 1 });
      }

      throw await this.errorMiddleware(convertError(err), options);
    }

    return await this.responseMiddleware<Data>(convertResponse<Data>(response), options);
  }
}
