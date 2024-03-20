import { DayType, GenEdType, SectionType, StdStatus } from "@/constants/enum";
import { Section } from "./section";

export class Subject {
  subjectCode: string;
  subjectNameTH?: string;
  subjectNameEN?: string;
  section: Array<Section>;
  setOfDay: Array<DayType>;
  setOfStdStatus: Array<StdStatus>;
  maxCredit?: number;
  sectionTypes?: Array<SectionType>;
  genEdType?: GenEdType;

  constructor(secionJson: any) {
    this.subjectCode = secionJson["subjectCode"];
    this.subjectNameTH =
      secionJson["subjectNameTH"] ?? secionJson["subjectNameTh"];
    this.subjectNameEN =
      secionJson["subjectNameEN"] ?? secionJson["subjectNameEn"];
    this.section = secionJson["section"] ?? { lecture: [], laboratory: [] };
    this.setOfDay = secionJson["setOfDay"] ?? [];
    this.setOfStdStatus = secionJson["setOfStdStatus"] ?? [];
    this.maxCredit = parseInt(
      secionJson["maxCredit"] ?? secionJson["credit"] ?? 0
    );
    this.sectionTypes = secionJson["sectionTypes"] ?? [];
    this.genEdType = secionJson["genEdType"];
  }
}
