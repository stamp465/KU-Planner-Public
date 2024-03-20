import { SubjectGrade } from "@/interface/SubjectGrade";

export interface StudentYearGrade {
  academicYear: string;
  gpa: number;
  cr: number;
  grade: Array<SubjectGrade>;
}
