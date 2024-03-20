import { ChoiceOfSection } from "@/interface/ChoiceOfSection";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const choiceOfSectionDBAtom = atomWithStorage<
  ChoiceOfSection | undefined
>("choiceOfSectionDBAtom", undefined);
