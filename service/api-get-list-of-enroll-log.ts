import { myKuServerHeader } from "@/constants/header";
import { apiUrl, getListOfEnrollResult } from "@/constants/path";
import { ApiResponse } from "@/interface/ApiResponse";
import {
  EnrollSubjectName,
  GetEnrollResultRequest,
} from "@/interface/GetEnrollLogRequest";
import axios from "axios";

export async function apiGetListOfEnrollResult(
  listOfGetEnrollResultRequest: GetEnrollResultRequest[],
  accessToken: string | null
) {
  return axios.get<ApiResponse<Record<string, EnrollSubjectName[]>>>(
    apiUrl + getListOfEnrollResult,
    {
      params: {
        listOfGetEnrollLogRequest: JSON.stringify(listOfGetEnrollResultRequest),
      },
      headers: myKuServerHeader(accessToken ?? ""),
    }
  );
}
