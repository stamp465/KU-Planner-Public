import { myKuServerHeader } from "@/constants/header";
import { savePlan } from "@/constants/path";
import { ApiResponse } from "@/interface/ApiResponse";
import { SavePlanRequest } from "@/interface/SavePlanRequest";
import axios from "axios";

export async function apiSavePlan(req: SavePlanRequest) {
  return axios.post<ApiResponse<string | null>>(
    savePlan,
    JSON.stringify({
      loginName: req.loginName,
      searchSubjects: req.searchSubjects,
      orderSubjects: req.orderSubjects,
      favoriteSubjects: req.favoriteSubjects,
      choiceOfSection: req.choiceOfSection,
    }),
    {
      headers: myKuServerHeader(req.accesstoken ?? "", req.renewtoken ?? ""),
    }
  );
}
