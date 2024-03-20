import { GenEdType } from "@/constants/enum";

export interface GenEd {
  genEdCode: string;
  genEdNameTH: string;
  genEdNameEN: string;
  genEdCredit: string;
  genEdType: GenEdType;
  start: number;
  startSemester: number;
  end: number | null;
}

export interface GenEdList {
  genEdCode: string;
  genEdList: Array<GenEd>;
}
