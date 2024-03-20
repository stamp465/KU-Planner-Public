import { myKuServerHeader } from "@/constants/header";
import { apiUrl, getStdPlanStructure } from "@/constants/path";
import { ApiResponse } from "@/interface/ApiResponse";
import { StdPlanStructureRequest } from "@/interface/stdPlanRequest";
import { StdPlanStructure } from "@/model/stdPlanStructure";
import axios from "axios";

export async function apiGetStdPlanStructure(req: StdPlanStructureRequest) {
  return axios.get<ApiResponse<Array<StdPlanStructure>>>(
    apiUrl + getStdPlanStructure,
    {
      params: {
        cmasterId: req.cmasterId,
      },
      headers: myKuServerHeader(req.accessToken ?? ""),
    }
  );
}
