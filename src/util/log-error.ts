import { IAxiosError } from "../typing";
import { Logger } from "@lindorm-io/winston";

interface ILogErrorOptions {
  logger: Logger;
  name: string;
  error: IAxiosError;
}

export const logError = ({ logger, name, error }: ILogErrorOptions): void => {
  logger.error(`${name} Responded with Error`, error);
};
