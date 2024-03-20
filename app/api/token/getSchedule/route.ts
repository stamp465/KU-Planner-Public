import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { myKuHeader } from "@/constants/header";
import { kuUrl, kuGetschedule } from "@/constants/path";
import { MyKUResponse } from "@/interface/MyKUResponse";
import { GetScheduleResponse } from "@/interface/GetScheduleRequest";

export async function GET(request: NextRequest) {
  const xAccessToken = request.headers.get("x-access-token");
  const searchParams = request.nextUrl.searchParams;
  const campusCode = searchParams.get("campusCode") ?? "";
  const facultyCode = searchParams.get("facultyCode") ?? "";
  const majorCode = searchParams.get("majorCode") ?? "";
  const userType = searchParams.get("userType") ?? "";
  const stdStatusCode = searchParams.get("stdStatusCode") ?? "";

  const { data, status } = await axios.get<MyKUResponse<GetScheduleResponse>>(
    kuUrl + kuGetschedule,
    {
      params: {
        campusCode: campusCode,
        facultyCode: facultyCode,
        majorCode: majorCode,
        userType: userType,
        stdStatusCode: stdStatusCode,
      },
      headers: myKuHeader(xAccessToken ?? ""),
    }
  );

  return NextResponse.json(
    { message: "OK", data: data.results },
    {
      status: status,
    }
  );
}
