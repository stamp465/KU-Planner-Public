import { ErrorType } from "@/constants/enum";

export class CustomError extends Error {
  message!: string;
  errorType!: ErrorType;

  constructor(error: any) {
    super();
    this.message = error["message"];
    this.errorType = error["errorType"];
  }
}
