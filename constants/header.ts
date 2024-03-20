import { RawAxiosRequestHeaders } from "axios";

export const myKuHeader = (accesstoken?: string): RawAxiosRequestHeaders => {
  return {
    "app-key": process.env.NEXT_PUBLIC_APP_KEY as string,
    "x-access-token": accesstoken,
    "content-type": "application/json",
  };
};

export const myKuServerHeader = (
  accesstoken?: string,
  renewtoken?: string
): RawAxiosRequestHeaders => {
  return {
    "app-key": process.env.NEXT_PUBLIC_TEMP_APP_KEY as string,
    "x-access-token": accesstoken,
    "content-type": "application/json",
    "x-renew-token": renewtoken,
  };
};

export const serverHeader = (): HeadersInit => {
  return {
    "app-key": process.env.NEXT_PUBLIC_TEMP_APP_KEY as string,
    "content-type": "application/json",
  };
};
