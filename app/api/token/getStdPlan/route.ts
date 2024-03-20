import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFileSync } from "fs";
import { CSVToJSON } from "@/utils/castUtils";
import { StdPlan } from "@/model/stdPlan";

export async function GET(request: NextRequest) {
  const xAccessToken = request.headers.get("x-access-token");
  const stdPlan = read_ku_plan_comEn(request);

  if (xAccessToken) {
    return NextResponse.json(
      { message: "Success", data: stdPlan },
      {
        status: HttpStatusCode.Ok,
      }
    );
  }
  return NextResponse.json(
    { message: "Unauthorized", data: null },
    {
      status: HttpStatusCode.Unauthorized,
    }
  );
}

function read_ku_plan_comEn(request: NextRequest) {
  //? Example structure
  // {
  //   'CMASTER_ID': '11305',
  //   CPLAN_ID: '5744',
  //   PLAN_NAME: 'สหกิจศึกษา',
  //   CLASS_LEVEL: '4',
  //   SEMESTER: '2',
  //   GROUP_LEVEL_ORDER: '2.2.5',
  //   GROUP_NAME_TH: 'กลุ่มทักษะวิชาชีพและจรรยาบรรณ',
  //   SUBJECT_CODE: '01204499',
  //   SUBJECT_NAME_TH: 'โครงงานวิศวกรรมคอมพิวเตอร์',
  //   SUBJECT_NAME_EN: 'Computer Engineering Project',
  //   COURSES_CODE: '2',
  //   COURSES_NAME_TH: 'หมวดวิชาเฉพาะ',
  //   COURSES_NAME_EN: '',
  //   SUBJECT_SHOW: '01204499',
  //   MAJOR_CODE: 'E09',
  //   CAMPUS_CODE: 'B',
  //   START_YEAR: '2560',
  //   END_YEAR: '2565'
  // }

  const searchParams = request.nextUrl.searchParams;
  const campusCode = searchParams.get("campusCode") ?? "";
  const cmasterId = searchParams.get("cmasterId") ?? "";
  // console.log(campusCode, cmasterId);

  // Read CSV file
  const configDirectory = path.resolve(process.cwd(), "asset");
  const file = readFileSync(
    path.join(configDirectory, "./ku_plan_comEn.csv"),
    "utf8"
  );

  const kuPlanComEn = CSVToJSON(file);
  // console.log(kuPlanComEn);
  const stdPlan = [];
  for (let i = 0; i < kuPlanComEn.length; i++) {
    const nowStdPlan = new StdPlan(kuPlanComEn[i]);
    // console.log(nowStdPlan.cmasterId, kuPlanComEn[i]);
    if (
      nowStdPlan.campusCode === campusCode &&
      nowStdPlan.cmasterId === cmasterId
    ) {
      stdPlan.push(nowStdPlan);
    }
    // stdPlan.push(new StdPlan(kuPlanComEn[i]));
  }
  // console.log(stdPlan[0]);
  return stdPlan;
}
