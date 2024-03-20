import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios, { HttpStatusCode } from "axios";
import { kuLogin, kuUrl } from "@/constants/path";
import { LoginRequest } from "@/interface/LoginRequest";

const { KU_PUBLIC_KEY, NEXT_PUBLIC_APP_KEY } = process.env;

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

export async function POST(request: NextRequest) {
  const loginRequest: LoginRequest = await request.json();
  // console.log("body", loginRequest.username, loginRequest.password);

  try {
    const { data, status } = await axios.post(
      kuUrl + kuLogin,
      {
        username: encodeString(loginRequest.username),
        password: encodeString(loginRequest.password),
      },
      {
        headers: {
          "app-key": NEXT_PUBLIC_APP_KEY as string,
          "content-type": "application/json",
        },
      }
    );
    if (status === HttpStatusCode.Ok) {
      return NextResponse.json(
        { message: "Success", data: data },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Error" }, { status: status });
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("error message: ", err.message);
      return NextResponse.json(
        { message: err.message },
        { status: err.response?.status ?? 500 }
      );
    } else {
      console.log("unexpected error: ", err);
      return NextResponse.json({ message: "Error" }, { status: 500 });
    }
  }
}
