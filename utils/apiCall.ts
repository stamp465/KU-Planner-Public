import { apiUrl, renew } from "@/constants/path";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { Session } from "next-auth";
import { jwtDecode } from "jwt-decode";
import {
  networkErrorSwal,
  unauthorizedSwal,
  unexpectedSwal,
} from "./errorHandler";
import { CustomError } from "@/model/error";
import { ErrorType } from "@/constants/enum";
import { UserRenewResponse } from "@/interface/UserRenewResponse";

interface apiCallInterface {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  params?: any;
  body?: any;
  session: Session | null;
}

interface serverApiCallInterface {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  cache?: RequestCache | undefined;
}

interface renewSessionApiCallInterface {
  session: Session | null;
  update: (data?: any) => Promise<Session | null>;
}

export async function clientApiCall(req: apiCallInterface) {
  try {
    return await axios(req.url, {
      method: req.method,
      params: req.params,
      headers: {
        "app-key": process.env.NEXT_PUBLIC_TEMP_APP_KEY as string,
        "x-access-token": req.session?.token.accesstoken,
        "content-type": "application/json",
      },
      data: req.body,
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      axiosErrorHandler(err);
    } else {
      unexpectedSwal();
    }
  }
}

function axiosErrorHandler(err: AxiosError) {
  if (err.response?.status == HttpStatusCode.Unauthorized) {
    unauthorizedSwal();
  } else if (
    err.response?.status == HttpStatusCode.InternalServerError ||
    err.response?.status == HttpStatusCode.BadGateway
  ) {
    networkErrorSwal();
  } else {
    unexpectedSwal();
  }
}

export async function serverApiCall(req: serverApiCallInterface) {
  return fetch(apiUrl + req.path, {
    method: req.method,
    headers: {
      "content-type": "application/json",
      "app-key": process.env.NEXT_PUBLIC_TEMP_APP_KEY as string,
    },
    body: JSON.stringify(req.body),
    cache: req.cache,
  });
}

export function isExp(accesstoken: string) {
  const decodedToken = jwtDecode(accesstoken);
  const expDate = new Date(decodedToken.exp! * 1000);
  const now = new Date(Date.now());
  if (expDate <= now) {
    return true;
  }
  return false;
}
