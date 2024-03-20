import { range } from "@/utils/subjectUtils";
import { tableColunmWidth } from "@/utils/tableUtils";
import clsx from "clsx";

export default function TableTimeHeader({
  startTime,
  endTime,
}: {
  startTime: number;
  endTime: number;
}) {
  const timeRange = range(startTime, endTime);
  return (
    <>
      <TimeHeader isLeft={true}>
        <div
          className="w-full text-center text-base lg:text-xl "
          style={{ minWidth: tableColunmWidth(true) }}>
          {"Time"}
        </div>
      </TimeHeader>
      <>
        {timeRange.map((time, index) => (
          <TimeHeader
            key={time}
            isRight={index == timeRange.length - 1}>{`${time
            .toString()
            .padStart(2, "0")}:00`}</TimeHeader>
        ))}
      </>
    </>
  );
}

function TimeHeader({
  children,
  isLeft,
  isRight,
}: {
  children: React.ReactNode;
  isLeft?: boolean;
  isRight?: boolean;
}) {
  return (
    <div
      className={clsx(
        " flex justify-start items-center border border-neutral-black  font-bold text-sm lg:text-base px-2 h-7",
        {
          "rounded-tl-md": isLeft,
          "rounded-tr-md": isRight,
        }
      )}>
      {children}
    </div>
  );
}
