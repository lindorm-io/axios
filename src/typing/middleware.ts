import { IAxiosError, IAxiosRequest, IAxiosResponse } from "./axios";

export interface IAxiosMiddleware {
  request?: (request: IAxiosRequest) => Promise<IAxiosRequest>;
  response?: (response: IAxiosResponse) => Promise<IAxiosResponse>;
  error?: (error: IAxiosError) => Promise<IAxiosError>;
}
