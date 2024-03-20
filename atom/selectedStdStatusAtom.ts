import { StdStatus } from "@/constants/enum";
import { atomWithStorage } from "jotai/utils";

export const selectedStdStatusAtom = atomWithStorage<StdStatus | null>(
  "selectedStdStatus",
  null
);
