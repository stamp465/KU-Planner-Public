import { UserData } from "@/model/userData";

export interface UserLoginResponse {
  code: string;
  message: string;
  accesstoken: string;
  renewtoken: string;
  user: UserData;
}
