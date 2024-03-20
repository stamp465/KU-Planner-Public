import { NextRequest, NextResponse } from "next/server";
import { parse, ParseResult } from "papaparse";
import { readFileSync } from "fs";
import path from "path";
import {
  SectionType,
  StdStatus,
  sectionCodeToStdStatus,
  DayType,
} from "@/constants/enum";
import { getCourseDateListCSV } from "@/utils/subjectUtils";
import { Subject } from "@/model/subject";
import { getAllGenEdFromCSV } from "../allGenEd/route";

export async function GET(request: NextRequest) {
  // Read CSV file
  const configDirectory = path.resolve(process.cwd(), "asset");
  const file = readFileSync(
    path.join(configDirectory, "./all_subj2.csv"),
    "utf8"
  );
  let data: Record<string, unknown>[] = [];
  parse(file, {
    complete: function (results: ParseResult<Record<string, unknown>>) {
      data = results.data;
    },
  });

  const genEdMap = getAllGenEdFromCSV();

  // CSV to Data
  if (data.length > 0) {
    let subjects: Array<Subject> = [];
    let setOfDay = new Set<DayType>();
    let setOfStdStatus = new Set<StdStatus>();
    let subjectsLength = 0;

    for (let i = 0; i < data.length; i++) {
      if (i === 0) continue;

      //checking i have data
      if (
        (data[i][2] == null && data[i][12] == null) ||
        ((data[i][2] as string).length === 0 &&
          (data[i][12] as string).length === 0)
      ) {
        continue;
      }

      // data[X][0] = subjectCode subjectNameTH (subjectNameEN)
      let subjCodeName: string = data[i][0] as string;
      if (subjCodeName.length > 0) {
        setOfDay.clear();
        setOfStdStatus.clear();
        subjects.push({
          subjectCode: subjCodeName.split(" ")[0],
          subjectNameTH: subjCodeName.split(" ")[1],
          subjectNameEN: subjCodeName.split(" ")[2].slice(1, -1),
          section: [],
          setOfDay: [],
          setOfStdStatus: [],
          sectionTypes: [],
          maxCredit: 0,
          genEdType: genEdMap.get(subjCodeName.split("-")[0])?.genEdList.at(-1)
            ?.genEdType,
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
        const maxCredit = data[i][2] as number;
        subjects[subjectsLength - 1].maxCredit =
          maxCredit > (subjects[subjectsLength - 1].maxCredit ?? 0)
            ? maxCredit
            : subjects[subjectsLength - 1].maxCredit;
        if (
          !subjects[subjectsLength - 1].sectionTypes?.includes(
            SectionType.Lecture
          )
        ) {
          subjects[subjectsLength - 1].sectionTypes?.push(SectionType.Lecture);
        }
      }

      // data[X][12] = Laboratory
      if ((data[i][12] as string).length > 0) {
        setOfStdStatus.add(sectionCodeToStdStatus(data[i][13] as number));
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
        const maxCredit = data[i][12] as number;
        subjects[subjectsLength - 1].maxCredit =
          maxCredit > (subjects[subjectsLength - 1].maxCredit ?? 0)
            ? maxCredit
            : subjects[subjectsLength - 1].maxCredit;
        if (
          !subjects[subjectsLength - 1].sectionTypes?.includes(
            SectionType.Laboratory
          )
        ) {
          subjects[subjectsLength - 1].sectionTypes?.push(
            SectionType.Laboratory
          );
        }
      }
    }

    return NextResponse.json(
      { message: "Success", data: subjects },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: "Error" }, { status: 500 });
}
