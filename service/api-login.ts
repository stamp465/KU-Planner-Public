import { myKuHeader } from "@/constants/header";
import { kuLogin, kuUrl, login } from "@/constants/path";
import { LoginRequest } from "@/interface/LoginRequest";
import { UserLoginResponse } from "@/interface/UserLoginResponse";
import axios from "axios";
const {
  KU_PUBLIC_KEY,
  NEXT_PUBLIC_APP_KEY,
  NEXT_PUBLIC_TEMP_APP_ID,
  NEXT_PUBLIC_TEMP_APP_PASSWORD,
  NEXT_PUBLIC_APP_ID,
  NEXT_PUBLIC_APP_PASSWORD,
} = process.env;
import crypto from "crypto";

const encodeString = (data: string) => {
  const kuPublicKey = KU_PUBLIC_KEY!.replace(/\\n/gm, "\n");
  return crypto
    .publicEncrypt(
      {
        key: kuPublicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      Buffer.from(data, "utf8")
    )
    .toString("base64");
};

export async function apiLogin(req: LoginRequest) {
  const username =
    req.username == NEXT_PUBLIC_TEMP_APP_ID
      ? (NEXT_PUBLIC_APP_ID as string)
      : req.username;
  const password =
    req.password == NEXT_PUBLIC_TEMP_APP_PASSWORD
      ? (NEXT_PUBLIC_APP_PASSWORD as string)
      : req.password;

  return axios.post<UserLoginResponse>(
    kuUrl + kuLogin,
    {
      username: encodeString(username),
      password: encodeString(password),
    },
    {
      headers: myKuHeader(),
    }
  );
}
