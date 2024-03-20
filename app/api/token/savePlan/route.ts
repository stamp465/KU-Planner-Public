import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { SavePlanRequest } from "@/interface/SavePlanRequest";
import { jwtDecode } from "jwt-decode";
import { apiRenew } from "@/service/api-renew";
import { isUserCreate, updateUser, writeUser } from "@/utils/prismaUtils";
import { isExp } from "@/utils/apiCall";

async function isTrueLoginName(
  accesstoken: string,
  xrenewtoken: string | null,
  savePlanRequest: SavePlanRequest
) {
  // check renew token
  if (xrenewtoken && !isExp(accesstoken)) {
    const { data, status } = await apiRenew({
      renewtoken: xrenewtoken,
    });
    // decode access token from renew
    const decodedTokenFromRenew = jwtDecode(data.accesstoken);
    const usernameFromRenew = JSON.parse(
      JSON.stringify(decodedTokenFromRenew)
    ).username;
    // decode access token
    const decodedToken = jwtDecode(accesstoken);
    const username = JSON.parse(JSON.stringify(decodedToken)).username;
    // check username
    if (
      username == savePlanRequest.loginName &&
      usernameFromRenew == username
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const xAccessToken = request.headers.get("x-access-token");
  const xrenewToken = request.headers.get("x-renew-token");

  const savePlanRequest: SavePlanRequest = await request.json();
  // console.log(xAccessToken);
  if (xAccessToken) {
    const canAccess = await isTrueLoginName(
      xAccessToken as string,
      xrenewToken as string | null,
      savePlanRequest
    );
    if (canAccess) {
      const haveUser = await isUserCreate(savePlanRequest);
      if (haveUser) {
        await updateUser(savePlanRequest);
        return NextResponse.json(
          { message: "Updated", data: null },
          { status: HttpStatusCode.Ok }
        );
      } else {
        await writeUser(savePlanRequest);
        return NextResponse.json(
          { message: "Created", data: null },
          {
            status: HttpStatusCode.Created,
          }
        );
      }
    }
  }
  return NextResponse.json(
    { message: "Unauthorized", data: null },
    {
      status: HttpStatusCode.Unauthorized,
    }
  );
}
