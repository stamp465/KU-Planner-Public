import { GenEdList } from "@/interface/GenEd";
import { atom } from "jotai";

export const allGenEdAtom = atom<Map<string, GenEdList>>(
  new Map<string, GenEdList>()
);
