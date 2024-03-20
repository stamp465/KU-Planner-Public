import { DayType, FilterMode, GenEdType, StdStatus } from "@/constants/enum";
import { TimeRange } from "./TimeRange";

export interface FilterSubject {
  searchInput: string;
  timeRange: TimeRange | null;
  setOfDay: Array<DayType>;
  setOfStdStatus: Array<StdStatus>;
  filterMode: FilterMode;
  setOfGenEdType: Array<GenEdType>;
  favorite: boolean;
}
