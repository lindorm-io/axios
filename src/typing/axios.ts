import { AuthType } from "../enum";
import { AxiosBasicCredentials, Method } from "axios";
import { IAxiosMiddleware } from "./middleware";
import { Logger } from "@lindorm-io/winston";

export interface IAxiosOptionsAuth {
  basic?: AxiosBasicCredentials;
  bearer?: string;
}

export interface IAxiosOptions {
  auth?: IAxiosOptionsAuth;
  baseUrl?: string;
  logger: Logger;
  middleware?: Array<IAxiosMiddleware>;
  name?: string;
}

export interface IAxiosConfig {
  auth?: AxiosBasicCredentials;
  host: string;
  method: Method;
  path: string;
  protocol: string;
  timeout?: number;
  url?: string;
}

export interface IAxiosError {
  config?: IAxiosConfig;
  debug?: Record<string, any>;
  details?: string;
  errorCode?: string;
  publicData?: Record<string, any>;
  request?: IAxiosRequest;
  response?: IAxiosResponse;
  statusCode?: number;
  title?: string;
}

export interface IAxiosRequest {
  data?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

export interface IAxiosResponse {
  data?: Record<string, unknown>;
  headers: Record<string, unknown>;
  status?: number;
  statusText?: string;
}

export interface IAxiosRequestConfig {
  method: Method;
  url: string;
}

export interface IAxiosRequestOptions extends IAxiosRequest {
  auth?: AuthType;
  middleware?: Array<IAxiosMiddleware>;
}

export interface IAxiosGetAuthData {
  auth?: AxiosBasicCredentials;
  headers?: {
    Authorization?: string;
  };
}
