import { myKuHeader } from "@/constants/header";
import { kuRenew, kuUrl } from "@/constants/path";
import { RenewRequest } from "@/interface/RenewRequest";
import { UserRenewResponse } from "@/interface/UserRenewResponse";
import axios from "axios";
const { NEXT_PUBLIC_APP_KEY } = process.env;

export async function apiRenew(req: RenewRequest) {
  return axios.post<UserRenewResponse>(
    kuUrl + kuRenew,
    {
      renewtoken: req.renewtoken,
    },
    {
      headers: myKuHeader(),
    }
  );
}
