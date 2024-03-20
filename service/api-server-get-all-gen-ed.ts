import { serverHeader } from "@/constants/header";
import { allGenEd, apiUrl } from "@/constants/path";
import { GenEdList } from "@/interface/GenEd";

export async function apiServerGetAllGenEd() {
  // "http://localhost:3000/api/allGenEd"
  const res = await fetch(apiUrl + allGenEd, {
    method: "GET",
    headers: serverHeader(),
  });

  const genEd = (await res.json()).data;
  const map = new Map<string, any>(JSON.parse(genEd));
  const keys = Array.from(map.keys());
  const values = Array.from(map.values());
  const genEdMap = new Map<string, GenEdList>(
    keys.map((key, index) => {
      return [key, values[index] as GenEdList];
    })
  );
  // console.log(genEdMap);
  // genEdMap.forEach((edMap) => {
  //   console.log(edMap.genEdCode, edMap.genEd);
  // });
  return genEdMap;
}
