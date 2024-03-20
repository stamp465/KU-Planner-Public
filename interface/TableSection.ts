import { SectionType, StdStatus } from "@/constants/enum";
import { CourseDate } from "./CourseDate";
import { Section } from "@/model/section";

export interface TableSection {
  subjectCode?: string;
  subjectNameEn?: string;
  subjectNameTh?: string;
  sectionCode?: string;
  coursedate?: CourseDate;
  coursedateen?: string;
  coursedateth?: string;
  roomName?: string;
  roomNameEn?: string;
  roomNameTh?: string;
  sectionId?: number;
  sectionStatus?: string;
  sectionType?: SectionType;
  sectionTypeEn?: string;
  sectionTypeTh?: string;
  stdStatus?: StdStatus;
  stdStatusEn?: string;
  stdStatusTh?: string;
  studentStatusCode?: string;
  teacherName?: string;
  teacherNameEn?: string;
}

export function sectionToTableSection(
  section: Section,
  courseDate: CourseDate
) {
  return {
    subjectCode: section.subjectCode,
    subjectNameEn: section.subjectNameEn,
    subjectNameTh: section.subjectNameTh,
    sectionCode: section.sectionCode,
    coursedate: courseDate,
    coursedateen: section.coursedateen,
    coursedateth: section.coursedateth,
    roomName: section.roomName,
    roomNameEn: section.roomNameEn,
    roomNameTh: section.roomNameTh,
    sectionId: section.sectionId,
    sectionStatus: section.sectionStatus,
    sectionType: section.sectionType,
    sectionTypeEn: section.sectionTypeEn,
    sectionTypeTh: section.sectionTypeTh,
    stdStatus: section.stdStatus,
    stdStatusEn: section.stdStatusEn,
    stdStatusTh: section.stdStatusTh,
    studentStatusCode: section.studentStatusCode,
    teacherName: section.teacherName,
    teacherNameEn: section.teacherNameEn,
  };
}
