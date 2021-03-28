import axios, { AxiosBasicCredentials, AxiosRequestConfig } from "axios";
import { IAxiosConfig, IAxiosError, IAxiosMiddleware, IAxiosRequest, IAxiosResponse } from "../typing";
import { Logger } from "@lindorm-io/winston";
import { axiosRequestSnakeKeysMiddleware, axiosResponseCamelKeysMiddleware } from "../middleware";
import { convertError, convertResponse, logError, logResponse } from "../util";
import { getResponseTime } from "../util/get-response-time";

export interface IAxiosOptions {
  baseUrl?: string;
  basicAuth?: AxiosBasicCredentials;
  bearerAuth?: string;
  logger: Logger;
  middleware?: Array<IAxiosMiddleware>;
  name?: string;
}

export class Axios {
  private baseUrl: string;
  private basicAuth: AxiosBasicCredentials | null;
  private bearerAuth: string;
  private logger: Logger;
  private middleware: Array<IAxiosMiddleware>;
  private name: string;

  constructor(options: IAxiosOptions) {
    this.baseUrl = options.baseUrl || null;
    this.basicAuth = options.basicAuth || null;
    this.bearerAuth = options.bearerAuth || null;
    this.logger = options.logger.createChildLogger("Axios");
    this.middleware = [
      axiosResponseCamelKeysMiddleware,
      ...(options.middleware || []),
      axiosRequestSnakeKeysMiddleware,
    ];
    this.name = options.name || null;
  }

  public async get(path: string, options?: IAxiosRequest): Promise<IAxiosResponse> {
    return this.request({ method: "get", url: this.url(path) } as IAxiosConfig, options || {});
  }

  public async post(path: string, data?: Record<string, unknown>, options?: IAxiosRequest): Promise<IAxiosResponse> {
    return this.request({ method: "post", url: this.url(path) } as IAxiosConfig, {
      data: data || {},
      ...(options || {}),
    });
  }

  public async put(path: string, data?: Record<string, unknown>, options?: IAxiosRequest): Promise<IAxiosResponse> {
    return this.request({ method: "put", url: this.url(path) } as IAxiosConfig, {
      data: data || {},
      ...(options || {}),
    });
  }

  public async patch(path: string, data?: Record<string, unknown>, options?: IAxiosRequest): Promise<IAxiosResponse> {
    return this.request({ method: "patch", url: this.url(path) } as IAxiosConfig, {
      data: data || {},
      ...(options || {}),
    });
  }

  public async delete(path: string, options?: IAxiosRequest): Promise<IAxiosResponse> {
    return this.request({ method: "delete", url: this.url(path) } as IAxiosConfig, options || {});
  }

  private config() {
    if (this.bearerAuth) return { headers: { Authorization: `Bearer ${this.bearerAuth}` } };
    if (this.basicAuth) return { headers: {}, auth: this.basicAuth };
    return { headers: {} };
  }

  private url(path: string): string {
    if (!this.baseUrl) return path;
    return new URL(path, this.baseUrl).toString();
  }

  private async requestMiddleware(request: IAxiosRequest): Promise<IAxiosRequest> {
    for (const mw of this.middleware) {
      if (!mw.request) continue;
      request = await mw.request(request);
    }
    return request;
  }

  private async responseMiddlware(response: IAxiosResponse): Promise<IAxiosResponse> {
    for (const mw of this.middleware) {
      if (!mw.response) continue;
      response = await mw.response(response);
    }
    return response;
  }

  private async errorMiddlware(error: IAxiosError): Promise<IAxiosError> {
    for (const mw of this.middleware) {
      if (!mw.error) continue;
      error = await mw.error(error);
    }
    return error;
  }

  private async request(config: IAxiosConfig, request: IAxiosRequest): Promise<IAxiosResponse> {
    const start = Date.now();

    const finalConfig = {
      ...this.config(),
      ...config,
    };

    const finalRequest = await this.requestMiddleware(request);

    const axiosRequestConfig = {
      ...finalConfig,
      ...finalRequest,
    } as AxiosRequestConfig;

    try {
      const response = await axios.request(axiosRequestConfig);

      const time = getResponseTime(response?.headers, start);

      logResponse({ logger: this.logger, name: this.name, time, response });

      return await this.responseMiddlware(convertResponse(response));
    } catch (err) {
      const time = getResponseTime(err?.response?.headers, start);

      logError({ logger: this.logger, name: this.name, time, error: err });

      throw await this.errorMiddlware(convertError(err));
    }
  }
}
