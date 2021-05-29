import { AxiosError, AxiosResponse } from "axios";
import { Logger } from "@lindorm-io/winston";

export interface IGetResponseTimeData {
  axios: number;
  server: number | undefined;
  diff: number | undefined;
}

export interface ILogOptions {
  logger: Logger;
  name: string | null;
  time: IGetResponseTimeData;
}

export interface ILogResponseOptions extends ILogOptions {
  response: AxiosResponse;
}

export interface ILogErrorOptions extends ILogOptions {
  error: AxiosError;
}
