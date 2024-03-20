import { myKuServerHeader } from "@/constants/header";
import { apiUrl, checkGrades } from "@/constants/path";
import { ApiResponse } from "@/interface/ApiResponse";
import { StudentYearGrade } from "@/interface/StudentYearGrade";
import axios from "axios";

export async function apiCheckGrade(accessToken: string, idcode: string) {
  return axios.get<ApiResponse<Array<StudentYearGrade>>>(apiUrl + checkGrades, {
    params: {
      idcode: idcode,
    },
    headers: myKuServerHeader(accessToken),
  });
}
