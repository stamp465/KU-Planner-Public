import { myKuHeader } from "@/constants/header";
import { kuGetStdEducation, kuUrl } from "@/constants/path";
import { MyKUResponse2 } from "@/interface/MyKUResponse";
import { StdEducation } from "@/interface/StdEducation";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const xAccessToken = request.headers.get("x-access-token");
  const searchParams = request.nextUrl.searchParams;
  const stdId = searchParams.get("stdId");

  const { data, status } = await axios.get<MyKUResponse2<StdEducation>>(
    kuUrl + kuGetStdEducation,
    {
      params: {
        stdId: stdId,
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
