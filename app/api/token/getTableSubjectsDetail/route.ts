import { myKuHeader } from "@/constants/header";
import { kuOpenSubjectForEnroll, kuUrl } from "@/constants/path";
import { MyKUResponse } from "@/interface/MyKUResponse";
import { Section } from "@/model/section";
import { Subject } from "@/model/subject";
import { stringToJSONArray } from "@/utils/castUtils";
import axios, { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
const { KU_ACADEMICYEAR, KU_SEMESTER } = process.env;

export async function GET(request: NextRequest) {
  const xAccessToken = request.headers.get("x-access-token");
  const searchParams = request.nextUrl.searchParams;
  const query = stringToJSONArray(searchParams.get("query"));
  const academicYear = searchParams.get("academicYear");
  const campusCode = searchParams.get("campusCode");
  const section = searchParams.get("section");
  const semester = searchParams.get("semester");

  if (
    query == null ||
    query?.filter(
      (subjectName) => subjectName == null || subjectName.length <= 4
    ).length > 0
  ) {
    return NextResponse.json([], { status: HttpStatusCode.NotFound });
  }

  const getWithPromiseAll = async () => {
    let subjectsDetail = new Map<string, Subject | null>();
    await Promise.all(
      query.map(async (subjectName) => {
        const { data, status } = await axios.get<MyKUResponse<Section>>(
          kuUrl + kuOpenSubjectForEnroll,
          {
            params: {
              query:
                subjectName != null && subjectName.length > 4
                  ? subjectName
                  : "-1",
              academicYear: academicYear ?? (KU_ACADEMICYEAR as string),
              semester: semester ?? (KU_SEMESTER as string),
              campusCode: campusCode ?? "B",
              section: section ?? "",
            },
            headers: myKuHeader(xAccessToken ?? ""),
          }
        );
        if (status != HttpStatusCode.Ok) {
          return NextResponse.json([], { status: status });
        }
        // console.log(data.results[0]);
        if (data.results.length == 0) {
          subjectsDetail.set(subjectName, null);
        } else {
          subjectsDetail.set(
            subjectName,
            new Subject({
              subjectCode:
                data.results.find((section) => section.subjectCode != undefined)
                  ?.subjectCode ?? "",
              subjectNameTH: data.results.find(
                (section) => section.subjectNameTh != undefined
              )?.subjectNameTh,
              subjectNameEN: data.results.find(
                (section) => section.subjectNameEn != undefined
              )?.subjectNameEn,
              maxCredit: data.results.find(
                (section) => section.maxCredit != undefined
              )?.maxCredit,
              setOfDay: [],
              setOfStdStatus: [],
              sectionTypes: [],
              section: data.results,
            })
          );
        }

        return data;
      })
    );
    return subjectsDetail;
  };
  const subjectsDetail = await getWithPromiseAll();

  return NextResponse.json(
    JSON.stringify(Array.from(subjectsDetail.entries())),
    {
      status: HttpStatusCode.Ok,
    }
  );
}
