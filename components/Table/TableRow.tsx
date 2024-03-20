import { DayType } from "@/constants/enum";
import clsx from "clsx";
import { tableBgColor10 } from "./TableDayHeader";
import { TableSection } from "@/interface/TableSection";
import TableSectionComponent from "./TableSection";

export default function TableRow({
  day,
  startTime,
  endTime,
  tableSections,
  isStart,
  isEnd,
}: {
  day: DayType;
  startTime: number;
  endTime: number;
  tableSections: Array<TableSection>;
  isStart?: boolean;
  isEnd?: boolean;
}) {
  const gridColumn = `span ${endTime - startTime} / span ${
    endTime - startTime
  }`;
  return (
    <>
      <div
        className={clsx(
          "relative w-full h-[95px]",
          tableBgColor10(day ?? DayType.None),
          {
            "rounded-br-md": isEnd,
          }
        )}
        style={{ gridColumn }}>
        {tableSections.map((section, index) => {
          return (
            <TableSectionComponent
              key={`TableSectionComponent ${section.subjectNameTh} ${section.sectionCode} ${section.sectionType}`}
              section={section}
              startTime={startTime}
              day={day}
              index={index}
            />
          );
        })}
      </div>
    </>
  );
}
