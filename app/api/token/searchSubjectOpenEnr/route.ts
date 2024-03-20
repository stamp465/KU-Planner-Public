import { myKuHeader } from "@/constants/header";
import { kuUrl, kusearchSubjectOpenEnr } from "@/constants/path";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const xAccessToken = request.headers.get("x-access-token");
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  const { data, status } = await axios.get(kuUrl + kusearchSubjectOpenEnr, {
    params: {
      query: query,
    },
    headers: myKuHeader(xAccessToken ?? ""),
  });

  return NextResponse.json(data, { status: status });
}
