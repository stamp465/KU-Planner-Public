import { myKuHeader, myKuServerHeader } from "@/constants/header";
import {
  kuSearchSectionDetail,
  kuUrl,
  searchSectionDetail,
} from "@/constants/path";
import { SearchSectionDetailRequest } from "@/interface/SearchSectionDetailRequest";
import { MyKUSearchSectionDetailResponse } from "@/model/searchSectionDetail";
import axios from "axios";

export async function apiSearchSectionDetail(req: SearchSectionDetailRequest) {
  return axios.get<MyKUSearchSectionDetailResponse>(searchSectionDetail, {
    params: {
      sectionId: req.sectionId,
    },
    headers: myKuServerHeader(req.accessToken),
  });
}
