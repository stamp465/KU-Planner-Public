import { NextRequest, NextResponse } from "next/server";
import axios, { HttpStatusCode } from "axios";
import { kuRenew, kuUrl } from "@/constants/path";
import { RenewRequest } from "@/interface/RenewRequest";

const { NEXT_PUBLIC_APP_KEY } = process.env;

export async function POST(request: NextRequest) {
  // const xAccessToken = request.headers.get("x-access-token");
  // console.log("-------------------------------- xAccessToken", xAccessToken);

  const renewRequest: RenewRequest = await request.json();
  // console.log("body", renewRequest.renewtoken);

  try {
    const { data, status } = await axios.post(
      kuUrl + kuRenew,
      {
        renewtoken: renewRequest.renewtoken,
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
    // can not renew should refresh
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
