export class StdPlan {
  cmasterId: string;
  cplanId: string;
  planName: string;
  classLevel: number;
  semester: number;
  groupLevelOrder: string;
  groupNameTH: string;
  subjectCode: string;
  subjectNameTH: string;
  subjectNameEN: string;
  coursesCode: string;
  coursesNameTH: string;
  coursesNameEN: string;
  subjectShow: string;
  majorCode: string;
  campusCode: string;
  startYear: number;
  endYear: number | null;

  constructor(stdPlanJson: any) {
    this.cmasterId = stdPlanJson["CMASTER_ID"];
    this.cplanId = stdPlanJson["CPLAN_ID"];
    this.planName = stdPlanJson["PLAN_NAME"];
    this.classLevel = stdPlanJson["CLASS_LEVEL"];
    this.semester = stdPlanJson["SEMESTER"];
    this.groupLevelOrder = stdPlanJson["GROUP_LEVEL_ORDER"];
    this.groupNameTH = stdPlanJson["GROUP_NAME_TH"];
    this.subjectCode = stdPlanJson["SUBJECT_CODE"];
    this.subjectNameTH = stdPlanJson["SUBJECT_NAME_TH"];
    this.subjectNameEN = stdPlanJson["SUBJECT_NAME_EN"];
    this.coursesCode = stdPlanJson["COURSES_CODE"];
    this.coursesNameTH = stdPlanJson["COURSES_NAME_TH"];
    this.coursesNameEN = stdPlanJson["COURSES_NAME_EN"];
    this.subjectShow = stdPlanJson["SUBJECT_SHOW"];
    this.majorCode = stdPlanJson["MAJOR_CODE"];
    this.campusCode = stdPlanJson["CAMPUS_CODE"];
    this.startYear = stdPlanJson["START_YEAR"];
    this.endYear = stdPlanJson["END_YEAR"];
  }
}
