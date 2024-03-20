export interface GetScheduleRequest {
  stdStatusCode: string;
  campusCode: string;
  facultyCode: string;
  majorCode: string;
  userType: string;
  accessToken: string | null;
}

export interface GetScheduleResponse {
  academicYr: number;
  semester: number;
}
