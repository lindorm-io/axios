import { AxiosResponse as Response } from "axios";
import { AxiosResponse } from "../typing";

export const convertResponse = <ResponseData>(response: Response): AxiosResponse<ResponseData> => ({
  data: response?.data || {},
  headers: response?.headers || {},
  status: response?.status,
  statusText: response?.statusText,
});
