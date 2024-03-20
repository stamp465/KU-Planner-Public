import { AxiosError, AxiosHeaders, AxiosResponse, HttpStatusCode } from "axios";
import Swal from "sweetalert2";

interface axiosErrorInterface {
  message: string;
  code?: string;
  status?: HttpStatusCode;
  statusText?: string;
}

export function axiosError({
  message,
  code,
  status,
  statusText,
}: axiosErrorInterface) {
  const errorResponse: AxiosResponse = {
    data: { message: message ?? "Axios Error" },
    status: status ?? 500,
    statusText: statusText ?? "Internal Server Error",
    headers: {
      "Content-Type": "application/json",
    },
    config: {
      headers: new AxiosHeaders({
        "Content-Type": "application/json",
      }),
    },
    request: {},
  };
  return new AxiosError(message, code, errorResponse.config, errorResponse);
}

export function unauthorizedSwal() {
  return Swal.fire({
    title: "Session expired",
    color: "#002706",
    icon: "error",
    iconColor: "#EC1E2B",
    confirmButtonColor: "#002706",
    allowOutsideClick: false,
    confirmButtonText: '<a href="/login">Login</a>',
    backdrop: "rgba(4, 92, 17, 0.75)",
  });
}

export function networkErrorSwal() {
  return Swal.fire({
    title: "Network/Server Error",
    color: "#002706",
    icon: "error",
    iconColor: "#EC1E2B",
    confirmButtonColor: "#002706",
    allowOutsideClick: false,
    confirmButtonText: '<a href="">Please Try Again</a>',
    backdrop: "rgba(4, 92, 17, 0.75)",
  });
}

export function unexpectedSwal() {
  return Swal.fire({
    title: "Unexpected Error",
    color: "#002706",
    icon: "error",
    iconColor: "#EC1E2B",
    confirmButtonColor: "#002706",
    allowOutsideClick: false,
    confirmButtonText: '<a href="">Please Try Again</a>',
    backdrop: "rgba(4, 92, 17, 0.75)",
  });
}
