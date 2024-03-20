import { Subject } from "@/model/subject";
import { atom } from "jotai";

export const tableSubjectsAtom = atom<Array<Subject | null>>([]);
