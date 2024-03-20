import { atomWithStorage } from "jotai/utils";

export const orderSubjectsAtom = atomWithStorage<Array<string>>(
  "orderSubjects",
  []
);
