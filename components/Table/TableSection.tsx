import { TableSection } from "@/interface/TableSection";
import clsx from "clsx";
import {
  hoverTableBgColor100,
  tableBgColor50,
  tableBorderColor,
} from "./TableDayHeader";
import { DayType } from "@/constants/enum";
import { useState } from "react";
import ChangeSectionModal from "./ChangeSectionModal";
import { tableColunmWidth } from "@/utils/tableUtils";
import { choiceOfSectionsAtom } from "@/atom/choiceOfSectionsAtom";
import { selectedChoiceOfSectionAtom } from "@/atom/selectedChoiceOfSectionAtom";
import { tableSubjectsAtom } from "@/atom/tableSubjectsAtom";
import { useAtom } from "jotai";

export default function TableSectionComponent({
  startTime,
  section,
  day,
  index,
}: {
  startTime: number;
  section: TableSection;
  day: DayType;
  index: number;
}) {
  // console.log(window.innerWidth);
  const [modal, setModal] = useState(false);
  const [selectedChoiceOfSection, setSelectedChoiceOfSection] = useAtom(
    selectedChoiceOfSectionAtom
  );
  const [choiceOfSections, setChoiceOfSections] = useAtom(choiceOfSectionsAtom);
  const [tableSubjects, setTableSubjects] = useAtom(tableSubjectsAtom);

  const startHour = section.coursedate?.timeRange?.startHour ?? 0;
  const startMinute = section.coursedate?.timeRange?.startMinute ?? 0;
  const endHour = section.coursedate?.timeRange?.endHour ?? 0;
  const endMinute = section.coursedate?.timeRange?.endMinute ?? 0;
  const start =
    day == DayType.None
      ? startTime + index * 2
      : startHour + (startMinute * 5) / 3 / 100;
  const end =
    day == DayType.None ? start + 2 : endHour + (endMinute * 5) / 3 / 100;

  const width = `${(end - start) * tableColunmWidth()}px`;
  const innerWidth = `${(end - start) * tableColunmWidth() - 16}px`;
  const left = `${(start - startTime) * tableColunmWidth()}px`;
  // console.log(section.subjectCode, end, start, width, left);
  // console.log(section);

  const nowIndexOfSection = tableSubjects.findIndex(
    (subject) => subject?.subjectCode == section.subjectCode
  );

  return (
    <>
      <div
        className={clsx(
          "absolute h-full flex flex-col p-2 justify-between items-start border-l-4",
          tableBgColor50(section.coursedate?.day ?? DayType.None),
          tableBorderColor(section.coursedate?.day ?? DayType.None),
          "hover:cursor-pointer",
          hoverTableBgColor100(section.coursedate?.day ?? DayType.None)
        )}
        onClick={() => {
          setModal(true);
          // console.log("----------table section----------");
          // console.log("a", nowIndexOfSection);
          // console.log("b", tableSubjects[nowIndexOfSection]?.section ?? []);
          // console.log(
          //   "c",
          //   choiceOfSections[selectedChoiceOfSection ?? 0].array[
          //     nowIndexOfSection
          //   ]
          // );
          // console.log("--------------------------------------");
        }}
        style={{ width, left }}>
        <div
          className=" text-sm font-bold flex flex-col text-neutral-black "
          style={{ width: innerWidth }}>
          <p className="truncate ">{section.subjectCode}</p>
          <p className="truncate ">{section.subjectNameTh}</p>
        </div>
        <div className=" text-xs font-base flex flex-col text-neutral-black">
          <p className="truncate ">{`หมู่ ${section.sectionCode} ${section.sectionType}`}</p>
          <p className="truncate ">{`ห้อง ${section.roomNameTh}`}</p>
        </div>
      </div>
      {nowIndexOfSection != -1 ? (
        <ChangeSectionModal
          sectionsData={tableSubjects[nowIndexOfSection]?.section ?? []}
          chooseSecs={
            choiceOfSections[selectedChoiceOfSection ?? 0].array[
              nowIndexOfSection
            ]
          }
          nowIndex={nowIndexOfSection}
          modal={modal}
          setModal={setModal}
        />
      ) : (
        <></>
      )}
    </>
  );
}
