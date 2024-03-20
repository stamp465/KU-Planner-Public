import { atomWithStorage } from "jotai/utils";

export const favoriteSubjectsAtom = atomWithStorage<Array<string>>(
  "favoriteSubjects",
  []
);
