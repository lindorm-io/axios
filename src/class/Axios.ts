import axios, { AxiosResponse } from "axios";
import { AuthType } from "../enum";
import { Logger } from "@lindorm-io/winston";
import { axiosCaseSwitchMiddleware } from "../middleware";
import { convertError, convertResponse, logAxiosError, logAxiosResponse } from "../util";
import { getResponseTime } from "../util/get-response-time";
import { startsWith } from "lodash";
import {
  IAxiosError,
  IAxiosMiddleware,
  IAxiosOptions,
  IAxiosOptionsAuth,
  IAxiosRequest,
  IAxiosRequestConfig,
  IAxiosRequestOptions,
  IAxiosResponse,
} from "../typing";

export class Axios {
  private auth: IAxiosOptionsAuth;
  private baseUrl: string;
  private logger: Logger;
  private middleware: Array<IAxiosMiddleware>;
  private name: string;

  constructor(options: IAxiosOptions) {
    this.auth = options.auth || null;
    this.baseUrl = options.baseUrl || null;
    this.logger = options.logger.createChildLogger("Axios");
    this.middleware = options.middleware || [];
    this.name = options.name || null;
  }

  public async get(path: string, options?: IAxiosRequestOptions): Promise<IAxiosResponse> {
    return this.request({ method: "get", url: this.getUrl(path) }, options || {});
  }

  public async post(path: string, options?: IAxiosRequestOptions): Promise<IAxiosResponse> {
    return this.request(
      { method: "post", url: this.getUrl(path) },
      {
        ...(options || {}),
      },
    );
  }

  public async put(path: string, options?: IAxiosRequestOptions): Promise<IAxiosResponse> {
    return this.request(
      { method: "put", url: this.getUrl(path) },
      {
        ...(options || {}),
      },
    );
  }

  public async patch(path: string, options?: IAxiosRequestOptions): Promise<IAxiosResponse> {
    return this.request(
      { method: "patch", url: this.getUrl(path) },
      {
        ...(options || {}),
      },
    );
  }

  public async delete(path: string, options?: IAxiosRequestOptions): Promise<IAxiosResponse> {
    return this.request({ method: "delete", url: this.getUrl(path) }, options || {});
  }

  private getAuth(options: IAxiosRequestOptions) {
    switch (options.auth) {
      case AuthType.BASIC:
        return { auth: this.auth.basic, headers: {} };

      case AuthType.BEARER:
        return { headers: { Authorization: `Bearer ${this.auth.bearer}` } };

      default:
        return { headers: {} };
    }
  }

  private getUrl(path: string): string {
    if (!this.baseUrl) return path;
    if (startsWith(path, "http")) return path;

    return new URL(path, this.baseUrl).toString();
  }

  private async requestMiddleware(request: IAxiosRequest, options: IAxiosRequestOptions): Promise<IAxiosRequest> {
    const middleware = [...this.middleware, ...(options.middleware || []), axiosCaseSwitchMiddleware];

    for (const mw of middleware) {
      if (!mw.request) continue;
      request = await mw.request(request);
    }

    return request;
  }

  private async responseMiddlware(response: IAxiosResponse, options: IAxiosRequestOptions): Promise<IAxiosResponse> {
    const middleware = [axiosCaseSwitchMiddleware, ...this.middleware, ...(options.middleware || [])];

    for (const mw of middleware) {
      if (!mw.response) continue;
      response = await mw.response(response);
    }

    return response;
  }

  private async errorMiddlware(error: IAxiosError, options: IAxiosRequestOptions): Promise<IAxiosError> {
    const middleware = [...this.middleware, ...(options.middleware || [])];

    for (const mw of middleware) {
      if (!mw.error) continue;
      error = await mw.error(error);
    }

    return error;
  }

  private async request(config: IAxiosRequestConfig, options: IAxiosRequestOptions): Promise<IAxiosResponse> {
    const start = Date.now();

    const request = await this.requestMiddleware(
      {
        data: options.data,
        headers: options.headers || {},
        params: options.params,
      },
      options,
    );
    const auth = this.getAuth(options);

    let response: AxiosResponse;

    try {
      response = await axios.request({
        ...config,
        ...(auth.auth ? { auth: auth.auth } : {}),
        ...request,
        headers: {
          ...auth.headers,
          ...request.headers,
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

      throw await this.errorMiddlware(convertError(err), options);
    }

    return await this.responseMiddlware(convertResponse(response), options);
  }
}
