// semester: 2;
// academicYear: 2566;
// stdId: 136930;

import { SubjectPassType } from "@/constants/enum";

export interface GetEnrollResultRequest {
  semester: string;
  academicYear: string;
  stdId: string;
  subjectCodes: string[];
  subjectCodesFail: string[];
}

// Response
// approve_status: "A";
// approve_status_name: "ลงทะเบียนสำเร็จ";
// campus_code: "B";
// campus_name_en: "Bangkhen";
// campus_name_th: "บางเขน";
// credit: "C";
// creditregis: 3;
// enroll_status: "เพิ่ม";
// enroll_status_code: "A";
// section_code: "1";
// section_id: 236187;
// section_type_code: "16901";
// section_type_name: "บรรยาย";
// subject_code: "01204437-60";
// subject_name_en: "Computer System Security";
// subject_name_th: "ความปลอดภัยระบบคอมพิวเตอร์";
// updated_dt: "2023-11-21T03:36:59.096Z";

export interface EnrollSubjectName {
  subjectCode: string;
  subjectNameTh: string;
  credit: number;
  isPass: SubjectPassType;
  yearSemester?: string;
  sectionCode?: string;
}

export interface GetEnrollResultResponse {
  code: string;
  enrollCredit: number;
  enrollSubjects: EnrollSubjectsResponse[];
}

export interface EnrollSubjectsResponse {
  // approveBy: null;
  // approveDt: null;
  // approveStatus: "A";
  // campusCode: "B";
  // campusNameEn: "Bangkhen";
  // campusNameTh: "บางเขน";
  // credit: 3;
  // creditShow: "3(3-0-6)";
  // enrollId: 4594263;
  // enrollStatus: "A";
  // enrollType: "92201";
  // enrollTypeEn: "C";
  // enrollTypeTh: "C";
  // flagEnrollTypeC: "N";
  // inchangeprocess: "N";
  // isPreRegister: null;
  // sectionCode: "1";
  // sectionId: 236187;
  // sectionType: "16901";
  // sectionTypeEn: "Lecture";
  // sectionTypeTh: "บรรยาย";
  // subjectCode: "01204437-60";
  // subjectNameEn: "Computer System Security";
  // subjectNameTh: "ความปลอดภัยระบบคอมพิวเตอร์";
  // subjectShow: "01204437";
  // subjectType: "16901";

  approveBy?: any;
  approveDt?: any;
  approveStatus: string;
  campusCode: string;
  campusNameEn: string;
  campusNameTh: string;
  credit: number;
  creditShow: string;
  enrollId: number;
  enrollStatus: string;
  enrollType: string;
  enrollTypeEn: string;
  enrollTypeTh: string;
  flagEnrollTypeC: string;
  inchangeprocess: string;
  isPreRegister?: any;
  sectionCode: string;
  sectionId: number;
  sectionType: string;
  sectionTypeEn: string;
  sectionTypeTh: string;
  subjectCode: string;
  subjectNameEn: string;
  subjectNameTh: string;
  subjectShow: string;
  subjectType: string;
}
