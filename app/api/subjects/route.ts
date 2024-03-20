import { NextRequest, NextResponse } from "next/server";
import { parse, ParseResult } from "papaparse";
import { readFileSync } from "fs";
import path from "path";
import {
  SectionType,
  StdStatus,
  sectionCodeToStdStatus,
  DayType,
  FilterMode,
} from "@/constants/enum";
import {
  getCourseDateListCSV,
  isSubjectsInSearchAndFilter,
} from "@/utils/subjectUtils";
import { Subject } from "@/model/subject";
import { stringToBoolean, stringToNumber } from "@/utils/castUtils";
import { FilterSubject } from "@/interface/FilterSubject";
import { PaginationResponse } from "@/interface/PaginationResponse";

export async function GET(request: NextRequest) {
  // console.log("searchParams", request.nextUrl.searchParams);
  // param Page for pagination ( page : 1 to N )
  // TODO: Handle NaN searchParam
  let page = parseInt(request.nextUrl.searchParams.get("page") ?? "1");
  const pageSize = parseInt(
    request.nextUrl.searchParams.get("pageSize") ?? "16"
  );
  const searchInput = request.nextUrl.searchParams.get("searchInput") ?? "";
  const startHour = request.nextUrl.searchParams.get("startHour");
  const startMinute = request.nextUrl.searchParams.get("startMinute");
  const endHour = request.nextUrl.searchParams.get("endHour");
  const endMinute = request.nextUrl.searchParams.get("endMinute");
  const setOfDay = JSON.parse(
    request.nextUrl.searchParams.get("setOfDay") ?? "[]"
  );
  const setOfStdStatus = JSON.parse(
    request.nextUrl.searchParams.get("setOfStdStatus") ?? "[]"
  );
  const filterMode =
    request.nextUrl.searchParams.get("filterMode") ?? FilterMode.Or;
  const favoriteSubjects = JSON.parse(
    request.nextUrl.searchParams.get("favoriteSubjects") ?? "[]"
  );
  // console.log("favoriteSubjects", favoriteSubjects);
  const favorite = stringToBoolean(
    request.nextUrl.searchParams.get("favorite")
  );

  const filterSubject = {
    searchInput: searchInput,
    timeRange: {
      startHour: stringToNumber(startHour) ?? 8,
      startMinute: stringToNumber(startMinute) ?? 0,
      endHour: stringToNumber(endHour) ?? 22,
      endMinute: stringToNumber(endMinute) ?? 0,
    },
    setOfDay: setOfDay,
    setOfStdStatus: setOfStdStatus,
    filterMode: filterMode,
    favorite: favorite,
  } as FilterSubject;
  // console.log("filterSubject", filterSubject);

  // Read CSV file
  const configDirectory = path.resolve(process.cwd(), "asset");
  const file = readFileSync(
    path.join(configDirectory, "./all_subj.csv"),
    "utf8"
  );
  let data: Record<string, unknown>[] = [];
  parse(file, {
    complete: function (results: ParseResult<Record<string, unknown>>) {
      data = results.data;
    },
  });

  // CSV to Data
  if (data.length > 0) {
    let subjects: Array<Subject> = [];
    let setOfDay = new Set<DayType>();
    let setOfStdStatus = new Set<StdStatus>();
    let subjectsLength = 0;

    for (let i = 0; i < data.length; i++) {
      if (i === 0) continue;

      // data[X][0] = subjectCode subjectNameTH (subjectNameEN)
      let subjCodeName: string = data[i][0] as string;
      if (subjCodeName.length > 0) {
        setOfDay.clear();
        subjects.push({
          subjectCode: subjCodeName.split(" ")[0],
          subjectNameTH: subjCodeName.split(" ")[1],
          subjectNameEN: subjCodeName.split(" ")[2].slice(1, -1),
          section: [],
          setOfDay: [],
          setOfStdStatus: [],
        });
        subjectsLength++;
      }

      // data[X][2] = Lecture
      if ((data[i][2] as string).length > 0) {
        setOfStdStatus.add(sectionCodeToStdStatus(data[i][3] as number));
        subjects[subjectsLength - 1].section?.push({
          sectionType: SectionType.Lecture,
          sectionCode: data[i][3] as string,
          maxCredit: data[i][2] as number,
          stdStatus: sectionCodeToStdStatus(data[i][3] as number),
          coursedate: getCourseDateListCSV(data[i][4] as string, setOfDay),
          roomName: data[i][5] as string,
        });
        subjects[subjectsLength - 1].setOfDay = Array.from(setOfDay);
        subjects[subjectsLength - 1].setOfStdStatus =
          Array.from(setOfStdStatus);
      }

      // data[X][12] = Laboratory
      if ((data[i][12] as string).length > 0) {
        setOfStdStatus.add(sectionCodeToStdStatus(data[i][3] as number));
        subjects[subjectsLength - 1].section?.push({
          sectionType: SectionType.Laboratory,
          sectionCode: data[i][13] as string,
          maxCredit: data[i][12] as number,
          stdStatus: sectionCodeToStdStatus(data[i][13] as number),
          coursedate: getCourseDateListCSV(data[i][14] as string, setOfDay),
          roomName: data[i][15] as string,
        });
        subjects[subjectsLength - 1].setOfDay = Array.from(setOfDay);
        subjects[subjectsLength - 1].setOfStdStatus =
          Array.from(setOfStdStatus);
      }
    }

    // console.log("searchInput", searchInput);
    const resultSubjects = subjects
      .filter((subj) =>
        isSubjectsInSearchAndFilter(subj, filterSubject, favoriteSubjects)
      )
      .sort((a, b) => (a.subjectCode < b.subjectCode ? -1 : 1));

    // for check max page
    const totalPage = Math.ceil(resultSubjects.length / pageSize);
    if (totalPage < page) {
      page = 1;
    }
    return NextResponse.json(
      {
        message: "Success",
        data: {
          paginationData: resultSubjects.slice(
            pageSize * (page - 1),
            pageSize * page
          ),
          pageSize: pageSize,
          currentPage: page,
          totalPage: totalPage,
        } as PaginationResponse<Subject>,
      },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: "Error" }, { status: 500 });
}
