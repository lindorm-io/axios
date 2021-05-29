import { ExtendableError } from "@lindorm-io/errors";
import { IAxiosConfig, IAxiosError, IAxiosRequest, IAxiosResponse } from "../typing";

export class AxiosRequestError extends ExtendableError implements IAxiosError {
  public readonly config: IAxiosConfig | undefined;
  public readonly request: IAxiosRequest | undefined;
  public readonly response: IAxiosResponse | undefined;
  public readonly statusCode: number | undefined;
  public readonly title: string | undefined;

  public constructor(message: string, options?: IAxiosError) {
    super(message, options);

    this.config = options?.config;
    this.request = options?.request;
    this.response = options?.response;
    this.statusCode = options?.statusCode;
    this.title = options?.title;
  }
}
