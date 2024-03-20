import { myKuServerHeader } from "@/constants/header";
import { searchSubjectOpenEnr } from "@/constants/path";
import {
  MyKUSearchSubjectOpenEnrResponse,
  SearchSubjectOpenEnrRequest,
} from "@/interface/searchSubjectOpenEnrRequest";
import axios from "axios";

export async function apiSearchSubjectOpenEnr(
  req: SearchSubjectOpenEnrRequest
) {
  return axios.get<MyKUSearchSubjectOpenEnrResponse>(searchSubjectOpenEnr, {
    params: {
      query: req.query,
    },
    headers: myKuServerHeader(req.accessToken),
  });
}
