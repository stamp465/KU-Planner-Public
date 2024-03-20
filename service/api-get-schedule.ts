import { myKuServerHeader } from "@/constants/header";
import { apiUrl, getSchedule } from "@/constants/path";
import { ApiResponse } from "@/interface/ApiResponse";
import {
  GetScheduleRequest,
  GetScheduleResponse,
} from "@/interface/GetScheduleRequest";
import axios from "axios";

export async function apiGetSchedule(request: GetScheduleRequest) {
  return axios.get<ApiResponse<Array<GetScheduleResponse>>>(
    apiUrl + getSchedule,
    {
      params: {
        campusCode: request.campusCode,
        facultyCode: request.facultyCode,
        majorCode: request.majorCode,
        userType: request.userType,
        stdStatusCode: request.stdStatusCode,
      },
      headers: myKuServerHeader(request.accessToken ?? ""),
    }
  );
}
