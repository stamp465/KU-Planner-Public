import { ChoiceOfSection } from "./ChoiceOfSection";

export interface SavePlanRequest {
  loginName: string;
  searchSubjects: string[];
  orderSubjects: string[];
  favoriteSubjects: string[];
  choiceOfSection?: ChoiceOfSection;
  renewtoken?: string;
  accesstoken?: string;
}

export interface SavePlanResponse {
  loginName: string;
  searchSubjects: string[];
  orderSubjects: string[];
  favoriteSubjects: string[];
  choiceOfSection?: string | null;
  renewtoken?: string;
  accesstoken?: string;
}
