export interface MajorCode {
  majorCode: string;
}

export interface MyKUSearchSectionDetailResponse {
  code: string;
  sectionDetail: SearchSectionDetail;
}

export class SearchSectionDetail {
  schedules: Array<any>;
  teacher: Array<any>;
  major: Array<MajorCode>;
  exmajor: Array<any>;
  midterm: any;
  final: any;

  constructor(searchSectionDetailJson: any) {
    this.schedules = searchSectionDetailJson["schedules"] ?? [];
    this.teacher = searchSectionDetailJson["teacher"] ?? [];
    this.major = searchSectionDetailJson["major"] ?? [];
    this.exmajor = searchSectionDetailJson["exmajor"] ?? [];
    this.midterm = searchSectionDetailJson["midterm"];
    this.final = searchSectionDetailJson["final"];
  }
}
