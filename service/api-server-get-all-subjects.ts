import { serverHeader } from "@/constants/header";
import { allSubjects, apiUrl } from "@/constants/path";
import { Subject } from "@/model/subject";
import axios from "axios";
const { NEXT_PUBLIC_APP_KEY, NEXT_PUBLIC_TEMP_APP_KEY } = process.env;

export async function apiServerGetAllSubjects() {
  const res = await fetch(apiUrl + allSubjects, {
    method: "GET",
    headers: serverHeader(),
  });
  const subjects = (await res.json()).data as Array<Subject>;
  return subjects;
}
