import { AnyObject } from "./util";
import { AxiosRequest, AxiosResponse, RequestConfig } from "./axios";
import { IAxiosRequestError } from "../error";

export interface AxiosMiddleware<Data = AnyObject> {
  config?: (config: RequestConfig) => Promise<RequestConfig>;
  request?: (request: AxiosRequest) => Promise<AxiosRequest>;
  response?: (response: AxiosResponse<Data>) => Promise<AxiosResponse<Data>>;
  error?: (error: IAxiosRequestError) => Promise<IAxiosRequestError>;
}
