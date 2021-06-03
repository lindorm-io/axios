import { AxiosError, AxiosRequest, AxiosResponse, RequestConfig } from "./axios";
import { AnyObject } from "./util";

export interface AxiosMiddleware<Data = AnyObject> {
  config?: (config: RequestConfig) => Promise<RequestConfig>;
  request?: (request: AxiosRequest) => Promise<AxiosRequest>;
  response?: (response: AxiosResponse<Data>) => Promise<AxiosResponse<Data>>;
  error?: (error: AxiosError) => Promise<AxiosError>;
}
