import { myKuHeader } from "@/constants/header";
import { kuUrl, kuSearchSectionDetail } from "@/constants/path";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const xAccessToken = request.headers.get("x-access-token");
  const searchParams = request.nextUrl.searchParams;
  const sectionId = searchParams.get("sectionId");

  const { data, status } = await axios.get(kuUrl + kuSearchSectionDetail, {
    params: {
      sectionId: sectionId,
    },
    headers: myKuHeader(xAccessToken ?? ""),
  });

  return NextResponse.json(data, { status: status });
}
