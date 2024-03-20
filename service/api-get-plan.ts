import { myKuServerHeader } from "@/constants/header";
import { getPlan } from "@/constants/path";
import { ApiResponse } from "@/interface/ApiResponse";
import { SavePlanRequest } from "@/interface/SavePlanRequest";
import axios from "axios";

export async function apiGetPlan(
  loginName: string | null,
  accessToken: string | null
) {
  return axios.get<ApiResponse<SavePlanRequest>>(getPlan, {
    params: {
      loginName: loginName ?? "",
    },
    headers: myKuServerHeader(accessToken ?? ""),
  });
}
