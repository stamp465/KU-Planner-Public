//? Example structure
//  {
//   'cstructure_id': '20365',
//   model_id: '',
//   cmaster_id: '10056',
//   group_level_order: '2.3.1',
//   credit_min: '1',
//   credit_max: '7',
//   group_name_th: 'กลุ่มประสบการณ์ภาคสนาม',
//   group_remark: '',
//   subjects_code: '[]',
// }

import { EnrollSubjectName } from "@/interface/GetEnrollLogRequest";

// make class StdPlanStructure that change json from py_case to camelCase
export class StdPlanStructure {
  cstructureId: string;
  modelId: string;
  cmasterId: string;
  groupLevelOrder: string;
  creditMin: string;
  creditMax: string;
  groupNameTh: string;
  groupRemark: string;
  subjectsCode: Array<string>;
  enrollSubjectNames: Array<EnrollSubjectName>;

  constructor(json: any) {
    this.cstructureId = json.cstructure_id;
    this.modelId = json.model_id;
    this.cmasterId = json.cmaster_id;
    this.groupLevelOrder = json.group_level_order;
    this.creditMin = json.credit_min;
    this.creditMax = json.credit_max;
    this.groupNameTh = json.group_name_th;
    this.groupRemark = json.group_remark;
    this.subjectsCode = ((json.subjects_code ?? "") as string).split("+");
    this.enrollSubjectNames = json.enrollSubjectNames
      ? JSON.parse(json.enrollSubjectNames) ?? []
      : [];
  }
}
