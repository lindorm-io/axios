import { ExtendableError } from "@lindorm-io/errors";
import { IAxiosConfig, IAxiosError, IAxiosRequest, IAxiosResponse } from "../typing";

export class AxiosRequestError extends ExtendableError implements IAxiosError {
  readonly config: IAxiosConfig;
  readonly request: IAxiosRequest;
  readonly response: IAxiosResponse;
  readonly statusCode: number;
  readonly title: string | null;

  constructor(message: string, options?: IAxiosError) {
    super(message, options);

    this.config = options.config;
    this.request = options.request;
    this.response = options.response;
    this.statusCode = options.statusCode;
    this.title = options.title;
  }
}
