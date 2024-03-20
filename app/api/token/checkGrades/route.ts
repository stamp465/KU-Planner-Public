import { myKuHeader } from "@/constants/header";
import { kuCheckGrades, kuUrl } from "@/constants/path";
import { MyKUResponse } from "@/interface/MyKUResponse";
import { StudentYearGrade } from "@/interface/StudentYearGrade";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const xAccessToken = request.headers.get("x-access-token");
  const searchParams = request.nextUrl.searchParams;
  const idcode = searchParams.get("idcode");

  const { data, status } = await axios.get<MyKUResponse<StudentYearGrade>>(
    kuUrl + kuCheckGrades,
    {
      params: {
        idcode: idcode,
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
