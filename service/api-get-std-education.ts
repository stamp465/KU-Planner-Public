import { myKuServerHeader } from "@/constants/header";
import { apiUrl, getStdEducation } from "@/constants/path";
import { ApiResponse } from "@/interface/ApiResponse";
import { StdEducation } from "@/interface/StdEducation";
import axios from "axios";

export async function apiGetStdEducation(accessToken: string, stdId: string) {
  return axios.get<ApiResponse<StdEducation>>(apiUrl + getStdEducation, {
    params: {
      stdId: stdId,
    },
    headers: myKuServerHeader(accessToken),
  });
}
