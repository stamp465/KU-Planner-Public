import { NextRequest, NextResponse } from "next/server";
import { parse, ParseResult } from "papaparse";
import { readFileSync } from "fs";
import path from "path";
import { GenEd, GenEdList } from "@/interface/GenEd";
import { GenEdType } from "@/constants/enum";

export function getAllGenEdFromCSV() {
  // Read CSV file
  const configDirectory = path.resolve(process.cwd(), "asset");
  const file = readFileSync(path.join(configDirectory, "./gen_ed.csv"), "utf8");
  let data: Record<string, unknown>[] = [];
  parse(file, {
    complete: function (results: ParseResult<Record<string, unknown>>) {
      data = results.data;
    },
  });

  let genEdMap = new Map<string, GenEdList>();
  // CSV to Data
  if (data.length > 0) {
    var genEdSubjectCodes = new Set<string>();

    for (let i = 0; i < data.length; i++) {
      const genEdSubject = data[i];
      if ((genEdSubject[0] as string).length === 0) continue;

      if (!genEdSubjectCodes.has(genEdSubject[0] as string)) {
        genEdSubjectCodes.add(genEdSubject[0] as string);
        genEdMap.set(genEdSubject[0] as string, {
          genEdCode: genEdSubject[0] as string,
          genEdList: [],
        });
      }
      const start = Number((genEdSubject[6] as string).split("-")[0]);
      genEdMap.get(genEdSubject[0] as string)!.genEdList.push({
        genEdCode: genEdSubject[0] as string,
        genEdNameTH: genEdSubject[1] as string,
        genEdNameEN: genEdSubject[2] as string,
        genEdCredit: genEdSubject[3] as string,
        genEdType: genEdSubject[5] as GenEdType,
        start: start,
        startSemester:
          Number((genEdSubject[6] as string).split("-")[1]) ?? null,
        end: start == 59 ? 64 : null,
      });
    }
  }

  return genEdMap;
}

export function GET(request: NextRequest) {
  try {
    const genEdMap = getAllGenEdFromCSV();
    return NextResponse.json(
      {
        message: "Success",
        data: JSON.stringify(Array.from(genEdMap.entries())),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
