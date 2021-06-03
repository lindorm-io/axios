import axios, { AxiosResponse as Response } from "axios";
import { Logger } from "@lindorm-io/winston";
import { axiosCaseSwitchMiddleware } from "../middleware/default";
import { convertError, convertResponse, logAxiosError, logAxiosResponse } from "../util";
import { getResponseTime } from "../util/get-response-time";
import { startsWith } from "lodash";
import {
  AxiosError,
  AxiosMiddleware,
  AxiosOptions,
  AxiosRequest,
  AxiosResponse,
  RequestConfig,
  RequestOptions,
  Unknown,
} from "../typing";
import { AuthType } from "../enum";

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
    return this.request<Data>({ method: "get", url: this.getUrl(path) }, options || {});
  }

  public async post<Data = Unknown>(path: string, options?: RequestOptions): Promise<AxiosResponse<Data>> {
    return this.request<Data>(
      { method: "post", url: this.getUrl(path) },
      {
        ...(options || {}),
      },
    );
  }

  public async put<Data = Unknown>(path: string, options?: RequestOptions): Promise<AxiosResponse<Data>> {
    return this.request<Data>(
      { method: "put", url: this.getUrl(path) },
      {
        ...(options || {}),
      },
    );
  }

  public async patch<Data = Unknown>(path: string, options?: RequestOptions): Promise<AxiosResponse<Data>> {
    return this.request<Data>(
      { method: "patch", url: this.getUrl(path) },
      {
        ...(options || {}),
      },
    );
  }

  public async delete<Data = Unknown>(path: string, options?: RequestOptions): Promise<AxiosResponse<Data>> {
    return this.request<Data>({ method: "delete", url: this.getUrl(path) }, options || {});
  }

  private getUrl(path: string): string {
    if (!this.baseUrl) return path;
    if (startsWith(path, "http")) return path;

    return new URL(path, this.baseUrl).toString();
  }

  private async configMiddleware(config: RequestConfig, options: RequestOptions): Promise<RequestConfig> {
    const middleware = [...this.middleware, ...(options.middleware || [])];

    for (const mw of middleware) {
      if (!mw.config) continue;
      config = await mw.config(config);
    }

    return config;
  }

  private async requestMiddleware(request: AxiosRequest, options: RequestOptions): Promise<AxiosRequest> {
    const middleware = [...this.middleware, ...(options.middleware || []), axiosCaseSwitchMiddleware];

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

  private async errorMiddleware(error: AxiosError, options: RequestOptions): Promise<AxiosError> {
    const middleware = [...this.middleware, ...(options.middleware || [])];

    for (const mw of middleware) {
      if (!mw.error) continue;
      error = await mw.error(error);
    }

    return error;
  }

  private async request<Data>(config: RequestConfig, options: RequestOptions): Promise<AxiosResponse<Data>> {
    const start = Date.now();

    const { auth, ...conf } = await this.configMiddleware(config, options);
    const request = await this.requestMiddleware(
      {
        data: options.data,
        headers: options.headers || {},
        params: options.params,
      },
      options,
    );
    const { Authorization, ...headers } = request.headers || {};

    let response: Response;

    try {
      response = await axios.request({
        ...(options.auth === AuthType.BASIC ? { auth } : {}),
        ...conf,
        ...request,
        headers: {
          ...(options.auth === AuthType.BEARER ? { Authorization } : {}),
          ...(headers ? headers : {}),
        },
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

      throw await this.errorMiddleware(convertError(err), options);
    }

    return await this.responseMiddleware<Data>(convertResponse<Data>(response), options);
  }
}
