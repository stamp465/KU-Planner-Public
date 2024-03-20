import { myKuHeader, myKuServerHeader } from "@/constants/header";
import {
  apiUrl,
  getTableSubjectsDetail,
  kuOpenSubjectForEnroll,
  kuUrl,
  openSubjectForEnroll,
} from "@/constants/path";
import { MyKUResponse } from "@/interface/MyKUResponse";
import { OpenSubjectForEnrollRequest } from "@/interface/OpenSubjectForEnrollRequest";
import { GetTableSubjectsDetailRequest } from "@/interface/getTableSubjectsDetailRequest";
import { Section } from "@/model/section";
import { Subject } from "@/model/subject";
import axios from "axios";
const { KU_ACADEMICYEAR, KU_SEMESTER } = process.env;

export async function apiGetTableSubjectsDetail(
  req: GetTableSubjectsDetailRequest
) {
  const { data, status } = await axios.get(getTableSubjectsDetail, {
    params: {
      query: JSON.stringify(req.query ?? []),
      academicYear: req.academicYear ?? (KU_ACADEMICYEAR as string),
      semester: req.semester ?? (KU_SEMESTER as string),
      campusCode: req.campusCode ?? "B",
      section: req.section ?? "",
    },
    headers: myKuServerHeader(req.accessToken),
  });
  const map = new Map<string, any>(JSON.parse(data));
  const keys = Array.from(map.keys());
  const values = Array.from(map.values());
  const sectionMap = new Map<string, Subject | null>(
    keys.map((key, index) => {
      // console.log(values[index]);
      return [
        key,
        values[index] == null
          ? ({
              subjectCode:
                req.query && req.query[index]
                  ? req.query[index]
                  : "ไม่ระบุรหัสวิชา",
              section: [],
              setOfDay: [],
              setOfStdStatus: [],
            } as Subject)
          : {
              ...new Subject(values[index]),
              section: values[index].section.map(
                (section: string) => new Section(section)
              ),
            },
      ];
    })
  );
  return { data: sectionMap, status: status };
}

export default function getTableSubjectsDetailStatic(
  querySubject: Array<string>,
  subjects: Subject[]
) {
  // console.log("subjects", subjects);
  const result = querySubject.map((subject) => {
    const findSubjects = subjects.find((s) => s.subjectCode === subject);
    if (findSubjects) {
      const findSubjectsEditSections: Subject = {
        ...findSubjects,
        section: findSubjects.section.map((newSection) => {
          return {
            ...newSection,
            subjectCode: findSubjects.subjectCode,
            subjectNameEn: findSubjects.subjectNameEN,
            subjectNameTh: findSubjects.subjectNameTH,
          };
        }),
      };
      return findSubjectsEditSections;
    }
    return findSubjects ?? null;
  });
  // console.log("result", result);

  const keys = querySubject;
  const sectionMap = new Map<string, Subject | null>(
    keys.map((key, index) => {
      return [key, result[index]];
    })
  );
  return sectionMap;
}
