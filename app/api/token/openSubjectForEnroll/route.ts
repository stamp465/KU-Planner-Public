import { myKuHeader } from "@/constants/header";
import { kuOpenSubjectForEnroll, kuUrl } from "@/constants/path";
import { MyKUResponse } from "@/interface/MyKUResponse";
import { Section } from "@/model/section";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
const { KU_ACADEMICYEAR, KU_SEMESTER } = process.env;

export async function GET(request: NextRequest) {
  const xAccessToken = request.headers.get("x-access-token");
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const academicYear = searchParams.get("academicYear");
  const campusCode = searchParams.get("campusCode");
  const section = searchParams.get("section");
  const semester = searchParams.get("semester");

  const { data, status } = await axios.get<MyKUResponse<Section>>(
    kuUrl + kuOpenSubjectForEnroll,
    {
      params: {
        query: query != null && query.length > 4 ? query : "-1",
        academicYear: academicYear ?? (KU_ACADEMICYEAR as string),
        semester: semester ?? (KU_SEMESTER as string),
        campusCode: campusCode ?? "B",
        section: section ?? "",
      },
      headers: myKuHeader(xAccessToken ?? ""),
    }
  );

  return NextResponse.json(data, { status: status });
}
