"use client";

import getTableSubjectsDetailStatic, {
  apiGetTableSubjectsDetail,
} from "@/service/api-get-table-subjects-detail";
import {
  getArrayOfChoiceOfSection,
  getMapTableSectionOfChoiceOfSection,
  indexChoiceOfSectionDBInChoiceOfSections,
} from "@/utils/tableUtils";
import { useSession } from "next-auth/react";
import { Fragment, RefObject, useEffect, useRef, useState } from "react";
import TableTimeHeader from "./TableTimeHeader";
import TableDayHeader from "./TableDayHeader";
import { DayType } from "@/constants/enum";
import TableRow from "./TableRow";
import { TableSection } from "@/interface/TableSection";
import { Subject } from "@/model/subject";
import { tableColunmWidth } from "@/utils/tableUtils";
import TablePageButton from "./TablePageButton";
import { useAtom } from "jotai";
import { allSubjectsAtom } from "@/atom/allSubjectsAtom";
import { selectedStdStatusAtom } from "@/atom/selectedStdStatusAtom";
import { choiceOfSectionsAtom } from "@/atom/choiceOfSectionsAtom";
import { maxGenerateChoicesAtom } from "@/atom/maxGenerateChoicesAtom";
import { selectedChoiceOfSectionAtom } from "@/atom/selectedChoiceOfSectionAtom";
import { tableSubjectsAtom } from "@/atom/tableSubjectsAtom";
import { choiceOfSectionDBAtom } from "@/atom/choiceOfSectionsDBAtom";

export default function Table() {
  const [startTime, setStartTime] = useState<number>(8);
  const [endTime, setEndTime] = useState<number>(20);
  const [startDay, setStartDay] = useState<number>(0);
  const [endDay, setEndDay] = useState<number>(7);
  const [notShowDayTypes, setNotShowDayTypes] = useState<DayType[]>([]);
  const [mapTableSection, setMapTableSection] =
    useState<Map<DayType, TableSection[]>>();

  const gridTemplateColumns = `1fr repeat(${
    endTime - startTime
  }, ${tableColunmWidth()}px)`;
  // `repeat(${endTime - startTime + 1}, 1fr)`;

  const { data: session } = useSession();
  const [allSubjects] = useAtom(allSubjectsAtom);
  const [selectedChoiceOfSection, setSelectedChoiceOfSection] = useAtom(
    selectedChoiceOfSectionAtom
  );
  const [choiceOfSections, setChoiceOfSections] = useAtom(choiceOfSectionsAtom);
  const [tableSubjects, setTableSubjects] = useAtom(tableSubjectsAtom);
  const [maxGenerateChoices, setMaxGenerateChoices] = useAtom(
    maxGenerateChoicesAtom
  );
  const [selectedStdStatus, setSelectedStdStatus] = useAtom(
    selectedStdStatusAtom
  );
  const [choiceOfSectionDB, setChoiceOfSectionDB] = useAtom(
    choiceOfSectionDBAtom
  );

  const [tableLoading, setTableLoading] = useState(true);

  const imageRef = useRef<HTMLDivElement>();

  const setFirstChoice = (
    data: Map<string, Subject | null>,
    orderSubjects: string[]
  ) => {
    // console.log("choiceOfSectionDB", choiceOfSectionDB);

    const tableSubjectsTmp = orderSubjects.map((subject) => {
      const findSubject = data.get(subject);
      return findSubject ?? null;
    });
    // console.log(data);
    setTableSubjects(tableSubjectsTmp);
    // console.log("tableSubjectsTmp", tableSubjectsTmp);

    const choiceOfSectionsTmp = getArrayOfChoiceOfSection({
      orderSections: tableSubjectsTmp.map((subjects) =>
        subjects == null ? [] : subjects.section
      ),
      maxChoice: maxGenerateChoices,
      session: session,
      selectedStdStatus: selectedStdStatus,
    });
    // console.log("choiceOfSectionsTmp", choiceOfSectionsTmp);
    setChoiceOfSections(choiceOfSectionsTmp);

    if (choiceOfSectionDB) {
      // console.log("------indexChoiceOfSectionDBInChoiceOfSections-------");
      const indexSelect = indexChoiceOfSectionDBInChoiceOfSections(
        choiceOfSectionDB,
        choiceOfSectionsTmp
      );
      // console.log("indexSelect", indexSelect);
      if (indexSelect != -1) {
        setSelectedChoiceOfSection(indexSelect);
      } else {
        // setSelectedChoiceOfSection(0);
        const newChoiceOfSections = [...choiceOfSectionsTmp, choiceOfSectionDB];
        // console.log("newChoiceOfSections", newChoiceOfSections);
        setChoiceOfSections(newChoiceOfSections);
        setSelectedChoiceOfSection(newChoiceOfSections.length - 1);
      }
    } else {
      setSelectedChoiceOfSection(0);
    }
  };

  useEffect(() => {
    setTableLoading(true);
    const orderSubjects = JSON.parse(
      localStorage.getItem("orderSubjects") ?? "[]"
    );
    // console.log("Table", selectedChoiceOfSection, orderSubjects); //, allSubjects);
    if (selectedChoiceOfSection == null) {
      // console.log("set new data");
      if (session?.user) {
        // console.log("user");
        apiGetTableSubjectsDetail({
          accessToken: session?.token.accesstoken,
          query: orderSubjects,
        }).then(({ data, status }) => {
          setFirstChoice(data, orderSubjects);
        });
      } else {
        // console.log("no user");
        const data = getTableSubjectsDetailStatic(orderSubjects, allSubjects);
        setFirstChoice(data, orderSubjects);
      }
    } else {
      // console.log("have data");
      const mapTableSectionOfChoiceOfSectionTmp =
        getMapTableSectionOfChoiceOfSection({
          orderSections: tableSubjects.map((subjects) =>
            subjects == null ? [] : subjects.section
          ),
          choiceOfSection: choiceOfSections[selectedChoiceOfSection],
        });
      setMapTableSection(mapTableSectionOfChoiceOfSectionTmp);
      // console.log("mapPPPP", mapTableSectionOfChoiceOfSectionTmp);
      // setChoiceOfSectionDB(choiceOfSections[selectedChoiceOfSection]);

      // const listSun = mapTableSectionOfChoiceOfSectionTmp.get(DayType.Sun);
      // const haveSun = listSun && listSun.length > 0 ? true : false;
      // const listSat = mapTableSectionOfChoiceOfSectionTmp.get(DayType.Sat);
      // const haveSat = listSat && listSat.length > 0 ? true : false;
      const listNone = mapTableSectionOfChoiceOfSectionTmp.get(DayType.None);
      const haveNone = listNone && listNone.length > 0 ? true : false;
      const notShowDayType = [];
      if (!haveNone) {
        notShowDayType.push(DayType.None);
      }
      // if (!haveSun && !haveSat) {
      //   notShowDayType.push(DayType.Sun);
      //   notShowDayType.push(DayType.Sat);
      // }
      // console.log("notShowDayType", notShowDayType);
      setNotShowDayTypes(notShowDayType);
    }
    setTableLoading(false);
  }, [selectedChoiceOfSection, choiceOfSections]);

  return (
    <>
      <TablePageButton imageRef={imageRef} />
      <div className="w-full flex overflow-x-auto max-w-[1280px] ">
        <div
          className="grid w-full relative"
          style={{ gridTemplateColumns: gridTemplateColumns }}
          ref={imageRef as unknown as RefObject<HTMLDivElement>}>
          {tableLoading && (
            <div className="absolute z-40 w-full h-full flex flex-col justify-center items-center mt-4 gap-2 bg-neutral-white opacity-30">
              <div className="font-bold">{`กำลังสร้างตาราง กรุณารอซักครู่`}</div>
              <div className="loading loading-dots loading-md"></div>
            </div>
          )}
          <TableTimeHeader
            startTime={startTime}
            endTime={endTime}
          />
          {Object.values(DayType)
            .filter((day) => !notShowDayTypes.includes(day))
            .map((day, index) => (
              <Fragment key={`TableRow ${day}`}>
                <TableDayHeader
                  day={day}
                  isStart={0 == index}
                  isEnd={
                    Object.values(DayType).filter(
                      (day) => !notShowDayTypes.includes(day)
                    ).length ==
                    index + 1
                  }
                />
                <TableRow
                  day={day}
                  startTime={startTime}
                  endTime={endTime}
                  tableSections={mapTableSection?.get(day) || []}
                  isStart={0 == index}
                  isEnd={
                    Object.values(DayType).filter(
                      (day) => !notShowDayTypes.includes(day)
                    ).length ==
                    index + 1
                  }
                />
              </Fragment>
            ))}
        </div>
      </div>
    </>
  );
}
