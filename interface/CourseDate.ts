import { DayType } from "@/constants/enum";
import { TimeRange } from "./TimeRange";

export interface CourseDate {
  day: DayType;
  timeRange?: TimeRange | null;
}
