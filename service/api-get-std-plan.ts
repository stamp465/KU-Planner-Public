import { myKuServerHeader } from "@/constants/header";
import { apiUrl, getStdPlan } from "@/constants/path";
import { ApiResponse } from "@/interface/ApiResponse";
import { StdPlanRequest } from "@/interface/stdPlanRequest";
import { StdPlan } from "@/model/stdPlan";
import axios from "axios";

export async function apiGetStdPlan(req: StdPlanRequest) {
  return axios.get<ApiResponse<Array<StdPlan>>>(apiUrl + getStdPlan, {
    params: {
      campusCode: req.campusCode,
      cmasterId: req.cmasterId,
    },
    headers: myKuServerHeader(req.accessToken ?? ""),
  });
}
