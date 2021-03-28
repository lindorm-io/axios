import { AxiosResponse } from "axios";
import { IAxiosResponse } from "../typing";

export const convertResponse = (response: AxiosResponse): IAxiosResponse => ({
  data: response?.data || {},
  headers: response?.headers || {},
  status: response?.status,
  statusText: response?.statusText,
});
