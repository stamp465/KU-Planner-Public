"use client";

import Button from "@/components/Button";
import CheckBoxList from "@/components/CheckboxList";
import {
  ButtonWidth,
  DayType,
  FilterMode,
  GenEdType,
  StdStatus,
} from "@/constants/enum";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { range, setFilterParams } from "@/utils/subjectUtils";
import { TimeRange } from "@/interface/TimeRange";
import {
  favoriteAtom,
  filterSubjectAtom,
  isChooseTimeRangeAtom,
  setOfDaysAtom,
  setOfGenEdTypeAtom,
  setOfStdStatusAtom,
  timeRangeAtom,
} from "@/atom/filterSubjectAtom";
import { useAtom } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { AiOutlineLike } from "react-icons/ai";
import { favoriteSubjectsAtom } from "@/atom/favoriteSubjectsAtom";
import { stringToNumber } from "@/utils/castUtils";

export default function FilterRightSide({
  onClick,
  isExpanded = false,
}: {
  onClick?: () => void;
  isExpanded?: boolean;
}) {
  const tSubjectsPage = useTranslations("SubjectsPage");
  const tChip = useTranslations("Chip");
  const tMode = useTranslations("Mode");
  const tStdStatus = useTranslations("StdStatus");
  const tGenEdType = useTranslations("GenEdType");
  const tGenEdPage = useTranslations("GenEdPage");

  const searchParams = useSearchParams()!;
  const page = stringToNumber(searchParams.get("page")) ?? 1;
  const router = useRouter();
  const pathname = usePathname();
  const [filterSubject, setFilterSubject] = useAtom(filterSubjectAtom);

  const [setOfDays, setSetOfDays] = useAtom(setOfDaysAtom);
  const [setOfStdStatus, setSetOfStdStatus] = useAtom(setOfStdStatusAtom);
  const [filterMode, setFilterMode] = useState<FilterMode>(
    filterSubject.filterMode
  );
  const [isChooseTimeRange, setIsChooseTimeRange] = useAtom(
    isChooseTimeRangeAtom
  );
  const [timeRange, setTimeRange] = useAtom(timeRangeAtom);
  const [setOfGenEdType, setSetOfGenEdType] = useAtom(setOfGenEdTypeAtom);
  const [favorite, setFavorite] = useAtom(favoriteAtom);
  const [favoriteSubjects] = useAtom(favoriteSubjectsAtom);

  function initWhenStateChange() {
    setSetOfDays([...filterSubject.setOfDay]);
    setSetOfStdStatus([...filterSubject.setOfStdStatus]);
    setFilterMode(filterSubject.filterMode);
    setIsChooseTimeRange(filterSubject.timeRange != null ? true : false);
    setTimeRange({
      startHour: filterSubject.timeRange?.startHour ?? 8,
      startMinute: filterSubject.timeRange?.startMinute ?? 0,
      endHour: filterSubject.timeRange?.endHour ?? 22,
      endMinute: filterSubject.timeRange?.endMinute ?? 0,
    });
    setSetOfGenEdType([...filterSubject.setOfGenEdType]);
  }

  useEffect(() => {
    // console.log("set");
    initWhenStateChange();
  }, [filterSubject]);

  useEffect(() => {
    // console.log("change");
    router.replace(
      `${pathname}?${setFilterParams({
        value: {
          page: page,
          ...{
            ...filterSubject,
            filterMode: filterMode,
            setOfDay: setOfDays,
            timeRange: isChooseTimeRange ? timeRange : null,
            setOfStdStatus: setOfStdStatus,
            setOfGenEdType: setOfGenEdType,
            favorite: favorite,
          },
        },
        searchParams: searchParams,
      })}`
    );
  }, [
    filterSubject,
    filterMode,
    setOfDays,
    isChooseTimeRange,
    timeRange,
    setOfStdStatus,
    setOfGenEdType,
    favorite,
    searchParams,
  ]);

  function selectTime(timeRangeKey: string, listOfTime: Array<number>) {
    const nowChooseTime =
      timeRange?.[timeRangeKey as keyof TimeRange] ?? listOfTime[0];
    return (
      <select
        value={nowChooseTime}
        className="text-sm bg-neutral-white px-2 border-b border-primary-green-900"
        onChange={(e) => {
          setTimeRange((oldState) => ({
            ...oldState,
            [timeRangeKey as keyof TimeRange]: Number(e.target.value),
          }));
        }}>
        {listOfTime.map((time) => (
          <option
            key={`${timeRangeKey}${time}`}
            className="">
            {time.toString().padStart(2, "0")}
          </option>
        ))}
      </select>
    );
  }

  // console.log("filterSubject in modal", filterSubject, setOfDays);

  return (
    <div
      className={clsx(" h-fit  ", {
        "w-full": isExpanded,
        "w-[240px] lg:w-fit p-4  rounded border-neutral-grey-400 border":
          !isExpanded,
      })}>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <h3 className="font-bold text-xl">{tSubjectsPage("FilterTitle")}</h3>
          {isExpanded && (
            <a href="#">
              <button className="btn btn-sm btn-circle btn-ghost">✕</button>
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-xs rounded-sm checkbox-success"
            checked={favorite}
            onChange={(e) => {
              setFavorite(e.target.checked);
            }}
          />
          <div className="text text-base flex gap-1 items-center flex-wrap">
            <div>{tSubjectsPage("SelectFavoriteSubjects")}</div>
            <div className="flex gap-x-1 shrink-0 items-center">
              <AiOutlineLike
                color={"#002706"}
                size={16}
              />
              {favoriteSubjects.length > 0 && (
                <div className="flex items-center justify-center font-bold text-xs w-5 h-5 rounded-full bg-neutral-black text-neutral-white">
                  {favoriteSubjects.length}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Choose Date Section */}
        <div className="flex flex-col">
          <div className="text text-base">
            {tSubjectsPage("StudyDateTitle")}
          </div>
          <div className={clsx("grid grid-cols-2")}>
            {Object.values(DayType).map((day) => (
              <CheckBoxList
                text={tChip(day)}
                checkData={day}
                checkList={setOfDays}
                setCheckList={setSetOfDays}
                key={`filter ${day}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col ">
          <div className="text text-base">
            {tSubjectsPage("StudyTypeTitle")}
          </div>
          <div
            className={clsx({ "grid grid-cols-2 md:grid-cols-4": isExpanded })}>
            {Object.values(StdStatus).map((std) => (
              <CheckBoxList
                text={tStdStatus(std)}
                checkData={std}
                checkList={setOfStdStatus}
                setCheckList={setSetOfStdStatus}
                key={`filter ${std}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col ">
          <div className="text text-base">{tGenEdPage("GenEdFilter")}</div>
          <div className={clsx({ "text-sm lg:text-base": !isExpanded })}>
            {Object.values(GenEdType).map((genEd) => (
              <CheckBoxList
                text={tGenEdType(genEd)}
                checkData={genEd}
                checkList={setOfGenEdType}
                setCheckList={setSetOfGenEdType}
                key={`filter ${genEd}`}
              />
            ))}
          </div>
        </div>

        {/* <div className="flex flex-col md:flex-row">
            <div className="text text-base">
              {tSubjectsPage("FilterTypeTitle")}
            </div>
            <div className="grid grid-cols-2">
              {Object.values(FilterMode).map((mode) => (
                <div
                  className="flex items-center gap-2 px-2"
                  key={`filter ${mode}`}>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs rounded-sm checkbox-success"
                    checked={filterMode == mode}
                    onChange={(e) => {
                      setFilterMode(mode);
                    }}
                  />
                  {tMode(mode)}
                </div>
              ))}
            </div>
          </div> */}

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-xs rounded-sm checkbox-success"
            checked={isChooseTimeRange}
            onChange={(e) => {
              setIsChooseTimeRange(e.target.checked);
            }}
          />
          <div className="flex flex-col">
            <div className="text text-base">
              {tSubjectsPage("TimeRangeTitle")}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9">{tSubjectsPage("FromText")}</div>
              <div>
                {selectTime("startHour", range(8, 23))}:
                {selectTime("startMinute", [0, 30])}
              </div>
              <div>{`น.`}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9">{tSubjectsPage("ToText")}</div>
              <div>
                {selectTime("endHour", range(8, 23))}:
                {selectTime("endMinute", [0, 30])}
              </div>
              <div>{`น.`}</div>
            </div>
          </div>
        </div>

        {/* <a href="#">
          <Button
            width={ButtonWidth.Expand}
            onClick={async () => {
              onClick?.();
              router.replace(
                `${pathname}?${setFilterParams({
                  value: {
                    page: 1,
                    ...{
                      ...filterSubject,
                      filterMode: filterMode,
                      setOfDay: setOfDays,
                      timeRange: isChooseTimeRange ? timeRange : null,
                      setOfStdStatus: setOfStdStatus,
                      setOfGenEdType: setOfGenEdType,
                      favorite: favorite,
                    },
                  },
                  searchParams: searchParams,
                })}`
              );
            }}>
            <div className="text-base font-bold text-neutral-white">
              {tSubjectsPage("FilterButtonText")}
            </div>
          </Button>
        </a> */}
      </div>
    </div>
  );
}
