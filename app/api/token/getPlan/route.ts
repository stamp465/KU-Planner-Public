import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { jwtDecode } from "jwt-decode";
import { readUser } from "@/utils/prismaUtils";
import { isExp } from "@/utils/apiCall";

async function isTrueLoginName(accesstoken: string, loginName: string) {
  if (!isExp(accesstoken)) {
    // decode access token
    const decodedToken = jwtDecode(accesstoken);
    const username = JSON.parse(JSON.stringify(decodedToken)).username;
    // check username
    if (username == loginName) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const xAccessToken = request.headers.get("x-access-token");
  const searchParams = request.nextUrl.searchParams;
  const loginName = searchParams.get("loginName") ?? "";
  // console.log(xAccessToken);
  if (xAccessToken) {
    const canAccess = await isTrueLoginName(xAccessToken as string, loginName);
    if (canAccess) {
      const userPlan = await readUser(loginName);
      return NextResponse.json(
        { message: "Success", data: userPlan },
        {
          status: HttpStatusCode.Ok,
        }
      );
    }
  }
  return NextResponse.json(
    { message: "Unauthorized", data: null },
    {
      status: HttpStatusCode.Unauthorized,
    }
  );
}
