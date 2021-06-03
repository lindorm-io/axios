import { ExtendableError } from "@lindorm-io/errors";
import { AxiosConfig, AxiosError, AxiosRequest, AxiosResponse, Unknown } from "../typing";

export class AxiosRequestError extends ExtendableError implements AxiosError {
  public readonly config: AxiosConfig | undefined;
  public readonly request: AxiosRequest | undefined;
  public readonly response: AxiosResponse<Unknown> | undefined;
  public readonly statusCode: number | undefined;
  public readonly title: string | undefined;

  public constructor(message: string, options?: AxiosError) {
    super(message, options);

    this.config = options?.config;
    this.request = options?.request;
    this.response = options?.response;
    this.statusCode = options?.statusCode;
    this.title = options?.title;
  }
}
