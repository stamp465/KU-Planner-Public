import { myKuHeader, myKuServerHeader } from "@/constants/header";
import {
  apiUrl,
  kuOpenSubjectForEnroll,
  kuUrl,
  openSubjectForEnroll,
} from "@/constants/path";
import { MyKUResponse } from "@/interface/MyKUResponse";
import { OpenSubjectForEnrollRequest } from "@/interface/OpenSubjectForEnrollRequest";
import { Section } from "@/model/section";
import axios from "axios";
const { KU_ACADEMICYEAR, KU_SEMESTER } = process.env;

export async function apiOpenSubjectForEnroll(
  req: OpenSubjectForEnrollRequest
) {
  return axios.get<MyKUResponse<Section>>(openSubjectForEnroll, {
    params: {
      query: req.query != null && req.query.length > 4 ? req.query : "-1",
      academicYear: req.academicYear ?? (KU_ACADEMICYEAR as string),
      semester: req.semester ?? (KU_SEMESTER as string),
      campusCode: req.campusCode ?? "B",
      section: req.section ?? "",
    },
    headers: myKuServerHeader(req.accessToken),
  });
}
