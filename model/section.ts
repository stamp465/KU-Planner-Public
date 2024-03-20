import {
  SectionType,
  StdStatus,
  sectionCodeToStdStatus,
  sectionTypeStringToSectionType,
} from "@/constants/enum";
import { getCourseDateListApi } from "@/utils/subjectUtils";
import { SearchSectionDetail } from "./searchSectionDetail";
import { CourseDate } from "@/interface/CourseDate";

export class Section {
  maxCredit?: number;
  sectionCode?: string;
  sectionType?: SectionType;
  stdStatus?: StdStatus;
  coursedate?: Array<CourseDate>;
  roomName?: string;
  coursedateen?: string;
  coursedateth?: string;
  finalDate?: string;
  flagRegisCon?: string;
  midternDate?: string;
  nonProperty?: string | null;
  property?: string | null;
  relateSubjectCode?: string;
  roomNameEn?: string;
  roomNameTh?: string;
  sectionId?: number;
  sectionStatus?: string;
  sectionTypeEn?: string;
  sectionTypeTh?: string;
  stdStatusEn?: string;
  stdStatusTh?: string;
  studentStatusCode?: string;
  subjectCode?: string;
  subjectNameEn?: string;
  subjectNameTh?: string;
  teacherName?: string;
  teacherNameEn?: string;
  totalRegistered?: string;
  totalSeat?: string;
  sectionDetail?: SearchSectionDetail;

  constructor(secionJson: any) {
    this.maxCredit = secionJson["maxCredit"];
    this.sectionCode = secionJson["sectionCode"];
    this.sectionType = sectionTypeStringToSectionType(
      secionJson["sectionType"]
    );
    this.stdStatus = sectionCodeToStdStatus(secionJson["sectionCode"]);
    this.coursedate = getCourseDateListApi(secionJson["coursedate"]) ?? [];
    this.roomName = secionJson["roomName"];
    this.coursedateen = secionJson["coursedateen"];
    this.coursedateth = secionJson["coursedateth"];
    this.finalDate = secionJson["finalDate"];
    this.flagRegisCon = secionJson["flagRegisCon"];
    this.midternDate = secionJson["midternDate"];
    this.nonProperty = secionJson["nonProperty"];
    this.property = secionJson["property"];
    this.relateSubjectCode = secionJson["relateSubjectCode"];
    this.roomNameEn = secionJson["roomNameEn"];
    this.roomNameTh = secionJson["roomNameTh"];
    this.sectionId = secionJson["sectionId"];
    this.sectionStatus = secionJson["sectionStatus"];
    this.sectionTypeEn = secionJson["sectionTypeEn"];
    this.sectionTypeTh = secionJson["sectionTypeTh"];
    this.stdStatusEn = secionJson["stdStatusEn"];
    this.stdStatusTh = secionJson["stdStatusTh"];
    this.studentStatusCode = secionJson["studentStatusCode"];
    this.subjectCode = secionJson["subjectCode"];
    this.subjectNameEn = secionJson["subjectNameEn"];
    this.subjectNameTh = secionJson["subjectNameTh"];
    this.teacherName = secionJson["teacherName"];
    this.teacherNameEn = secionJson["teacherNameEn"];
    this.totalRegistered = secionJson["totalRegistered"];
    this.totalSeat = secionJson["totalSeat"];
  }
}
