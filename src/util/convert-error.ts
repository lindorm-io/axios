import { AxiosError } from "axios";
import { AxiosRequestError } from "../error";

export const convertError = (error: AxiosError): AxiosRequestError => {
  const lindormKoaError = error?.response?.data?.error || {};
  const message = error.message || "Axios Request Handler encountered an error";

  return new AxiosRequestError(message, {
    config: {
      host: error?.request?.host,
      method: error?.request?.method,
      path: error?.request?.path,
      protocol: error?.request?.protocol,
      timeout: error?.config?.timeout,
      url: error?.config?.url,
    },
    debug: {
      message: lindormKoaError.message,
      name: lindormKoaError.name,
    },
    details: lindormKoaError.details || error?.response?.statusText,
    errorCode: lindormKoaError.code,
    publicData: lindormKoaError.data,
    request: {
      data: error?.config?.data,
      headers: error?.config?.headers,
      params: error?.config?.params,
    },
    response: {
      data: error?.response?.data,
      headers: error?.response?.headers,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
    },
    statusCode: error?.response?.status,
    title: lindormKoaError.title,
  });
};
