import { Subject } from "@/model/subject";
import { atom } from "jotai";

export const allSubjectsAtom = atom<Array<Subject>>([]);
