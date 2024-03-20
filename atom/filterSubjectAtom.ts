import { DayType, FilterMode, GenEdType, StdStatus } from "@/constants/enum";
import { FilterSubject } from "@/interface/FilterSubject";
import { TimeRange } from "@/interface/TimeRange";
import { atom } from "jotai";

export const saveFilterSubjectAtom = atom<FilterSubject>({
  searchInput: "",
  timeRange: null,
  setOfDay: [],
  setOfStdStatus: [],
  filterMode: FilterMode.Or,
  setOfGenEdType: [],
  favorite: false,
});

export const filterSubjectAtom = atom(
  (get) => get(saveFilterSubjectAtom),
  (get, set, newFilterSubject: FilterSubject) => {
    // console.log("set newFilterSubject");
    set(saveFilterSubjectAtom, newFilterSubject);
    set(setOfDaysAtom, newFilterSubject.setOfDay);
    set(setOfStdStatusAtom, newFilterSubject.setOfStdStatus);
    set(
      isChooseTimeRangeAtom,
      newFilterSubject.timeRange != null ? true : false
    );
    set(timeRangeAtom, {
      startHour: newFilterSubject.timeRange?.startHour ?? 8,
      startMinute: newFilterSubject.timeRange?.startMinute ?? 0,
      endHour: newFilterSubject.timeRange?.endHour ?? 22,
      endMinute: newFilterSubject.timeRange?.endMinute ?? 0,
    });
    set(setOfGenEdTypeAtom, newFilterSubject.setOfGenEdType);
    set(favoriteAtom, newFilterSubject.favorite);
  }
);

export const setOfDaysAtom = atom<Array<DayType>>([]);

export const setOfStdStatusAtom = atom<Array<StdStatus>>([]);

export const isChooseTimeRangeAtom = atom<boolean>(false);

export const timeRangeAtom = atom<TimeRange>({
  startHour: 8,
  startMinute: 0,
  endHour: 22,
  endMinute: 0,
});

export const setOfGenEdTypeAtom = atom<Array<GenEdType>>([]);

export const favoriteAtom = atom<boolean>(false);
