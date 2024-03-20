import { atomWithStorage } from "jotai/utils";

export const searchSubjectsAtom = atomWithStorage<Array<string>>(
  "searchSubjects",
  []
);
