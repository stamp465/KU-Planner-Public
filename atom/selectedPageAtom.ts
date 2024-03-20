import { atomWithStorage } from "jotai/utils";

export const selectedPageAtom = atomWithStorage<1 | 2>("selectedPage", 1);
