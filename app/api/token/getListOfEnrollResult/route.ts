import axios, { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { myKuHeader } from "@/constants/header";
import { kuUrl, kuSearchEnrollResult } from "@/constants/path";
import { MyKUResponse } from "@/interface/MyKUResponse";
import {
  EnrollSubjectName,
  GetEnrollResultRequest,
  GetEnrollResultResponse,
} from "@/interface/GetEnrollLogRequest";
import { SubjectPassType } from "@/constants/enum";

export async function GET(request: NextRequest) {
  const xAccessToken = request.headers.get("x-access-token");
  const searchParams = request.nextUrl.searchParams;
  const listOfGetEnrollLogHeaderByStdIdRequest = JSON.parse(
    searchParams.get("listOfGetEnrollLogRequest") ?? "[]"
  ) as GetEnrollResultRequest[];

  const getListOfEnrollLogSubjectName = async () => {
    const mapYearAndEnrollLog: Record<string, EnrollSubjectName[]> = {};

    await Promise.all(
      listOfGetEnrollLogHeaderByStdIdRequest.map(
        async (enrollLogHeaderByStdIdRequest) => {
          const yearSe = `${enrollLogHeaderByStdIdRequest.academicYear}/${enrollLogHeaderByStdIdRequest.semester}`;
          mapYearAndEnrollLog[yearSe] = [];
          const { data, status } = await axios.post<GetEnrollResultResponse>(
            kuUrl + kuSearchEnrollResult,
            {
              semester: enrollLogHeaderByStdIdRequest.semester,
              academicYear: enrollLogHeaderByStdIdRequest.academicYear,
              stdId: enrollLogHeaderByStdIdRequest.stdId,
            },
            { headers: myKuHeader(xAccessToken ?? "") }
          );
          if (status == HttpStatusCode.Ok) {
            data.enrollSubjects.forEach((enrollSubject) => {
              // console.log(
              //   enrollSubject.subjectCode,
              //   enrollLogHeaderByStdIdRequest.subjectCodes
              // );
              if (
                mapYearAndEnrollLog[yearSe].filter(
                  (enrollSubjectName) =>
                    enrollSubjectName.subjectCode === enrollSubject.subjectCode
                ).length === 0
              ) {
                mapYearAndEnrollLog[yearSe].push({
                  subjectCode: enrollSubject.subjectCode,
                  subjectNameTh: enrollSubject.subjectNameTh,
                  credit: enrollSubject.credit,
                  isPass: enrollLogHeaderByStdIdRequest.subjectCodes.includes(
                    enrollSubject.subjectCode.split("-")[0]
                  )
                    ? SubjectPassType.Pass
                    : enrollLogHeaderByStdIdRequest.subjectCodesFail.includes(
                        enrollSubject.subjectCode.split("-")[0]
                      )
                    ? SubjectPassType.Fail
                    : SubjectPassType.Now,
                  sectionCode: enrollSubject.sectionCode,
                });
              } else {
                mapYearAndEnrollLog[yearSe].find(
                  (enrollSubjectName) =>
                    enrollSubjectName.subjectCode === enrollSubject.subjectCode
                )!.credit += enrollSubject.credit;
              }
            });
          }
        }
      )
    );
    return mapYearAndEnrollLog;
  };
  const mapYearAndEnrollLog = await getListOfEnrollLogSubjectName();

  return NextResponse.json(
    { message: "OK", data: mapYearAndEnrollLog },
    {
      status: HttpStatusCode.Ok,
    }
  );
}
