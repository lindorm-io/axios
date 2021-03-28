import { AxiosBasicCredentials } from "axios";

export interface IAxiosConfig {
  auth?: AxiosBasicCredentials;
  host: string;
  method: string;
  path: string;
  protocol: string;
  timeout: number;
  url: string;
}

export interface IAxiosError {
  config: IAxiosConfig;
  debug?: Record<string, any>;
  details?: string;
  errorCode?: string;
  publicData?: Record<string, any>;
  request: IAxiosRequest;
  response: IAxiosResponse;
  statusCode: number;
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
  status: number;
  statusText: string;
}
