import { Subject } from "@/model/subject";

export interface SearchSubjectOpenEnrRequest {
  query: string;
  accessToken?: string;
}

export interface MyKUSearchSubjectOpenEnrResponse {
  code: string;
  subjects: Array<Subject>;
}
