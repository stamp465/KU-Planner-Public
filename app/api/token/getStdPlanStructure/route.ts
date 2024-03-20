import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFileSync } from "fs";
import { CSVToJSON } from "@/utils/castUtils";
import { StdPlanStructure } from "@/model/stdPlanStructure";

export async function GET(request: NextRequest) {
  const xAccessToken = request.headers.get("x-access-token");

  // console.log(campusCode, majorCode, startYear, cmasterId);

  const stdPlanStructure = read_CUR_T_CUR_STRUCTURE(request);

  if (xAccessToken) {
    return NextResponse.json(
      { message: "Success", data: stdPlanStructure },
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

function read_CUR_T_CUR_STRUCTURE(request: NextRequest) {
  //? Example structure
  //  {
  //   'cstructure_id': '20365',
  //   model_id: '',
  //   cmaster_id: '10056',
  //   group_level_order: '2.3.1',
  //   show_level: '0',
  //   group_type: '2',
  //   group_standard_learning: '0',
  //   courses_code: '2',
  //   credit_min: '1',
  //   credit_max: '7',
  //   group_name_th: 'กลุ่มประสบการณ์ภาคสนาม',
  //   group_name_en: '',
  //   show_report_mua: '1',
  //   group_remark: '',
  //   structure_type_flag: '0',
  //   edulevel_code: '',
  //   academic_year: '',
  //   screen_code: 'CUR_T02_309'
  //   subjects_code: '[]',
  // }

  const searchParams = request.nextUrl.searchParams;
  const cmasterId = searchParams.get("cmasterId") ?? "";

  // Read CSV file
  const configDirectory = path.resolve(process.cwd(), "asset");
  const file2 = readFileSync(
    path.join(configDirectory, "./CUR_T_CUR_STRUCTURE_STR_SUBJECT.csv"),
    "utf8"
  );
  const kuPlanStructure = CSVToJSON(file2);
  // console.log(kuPlanStructure[0]);
  const kuStdPlanStructure: StdPlanStructure[] = kuPlanStructure.map(
    (kuPlanStructureN, index) => {
      return new StdPlanStructure(kuPlanStructureN);
    }
  );

  const kuPlanStructureList = kuStdPlanStructure.filter((kuPlanStructureN) => {
    return kuPlanStructureN.cmasterId == cmasterId;
  });
  return kuPlanStructureList.sort((a, b) => {
    if (a.modelId > b.modelId) {
      return 1;
    } else if (a.modelId < b.modelId) {
      return -1;
    } else {
      if (a.groupLevelOrder > b.groupLevelOrder) {
        return 1;
      } else if (a.groupLevelOrder < b.groupLevelOrder) {
        return -1;
      } else {
        return 0;
      }
    }
  });
  // console.log(
  //   kuPlanStructureList.sort((a, b) => {
  //     if (a["group_level_order"] > b["group_level_order"]) {
  //       return 1;
  //     } else if (a["group_level_order"] < b["group_level_order"]) {
  //       return -1;
  //     } else {
  //       return 0;
  //     }
  //   })
  //   // .map((kuPlanStructureN) => kuPlanStructureN["group_level_order"])
  // );
}
