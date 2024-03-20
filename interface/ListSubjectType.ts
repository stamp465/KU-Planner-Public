import { Section } from "@/model/section";

export interface ListSubjectType {
  lecture: Array<Section>;
  laboratory: Array<Section>;
}
