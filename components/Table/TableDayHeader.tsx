import { DayType } from "@/constants/enum";
import clsx from "clsx";

export const tableBorderColor = (day: DayType) => {
  return clsx({
    "border-day-sun": day == DayType.Sun,
    "border-day-mon": day == DayType.Mon,
    "border-day-tue": day == DayType.Tue,
    "border-day-wed": day == DayType.Wed,
    "border-day-thu": day == DayType.Thu,
    "border-day-fri": day == DayType.Fri,
    "border-day-sat": day == DayType.Sat,
    "border-neutral-grey-700": day == DayType.None,
  });
};

export const tableBgColor = (day: DayType) => {
  return clsx({
    "bg-day-sun": day == DayType.Sun,
    "bg-day-mon": day == DayType.Mon,
    "bg-day-tue": day == DayType.Tue,
    "bg-day-wed": day == DayType.Wed,
    "bg-day-thu": day == DayType.Thu,
    "bg-day-fri": day == DayType.Fri,
    "bg-day-sat": day == DayType.Sat,
    "bg-neutral-grey-500": day == DayType.None,
  });
};

export const tableBgColor10 = (day: DayType) => {
  return clsx({
    "bg-day-sun-10": day == DayType.Sun,
    "bg-day-mon-10": day == DayType.Mon,
    "bg-day-tue-10": day == DayType.Tue,
    "bg-day-wed-10": day == DayType.Wed,
    "bg-day-thu-10": day == DayType.Thu,
    "bg-day-fri-10": day == DayType.Fri,
    "bg-day-sat-10": day == DayType.Sat,
    "bg-neutral-grey-50": day == DayType.None,
  });
};

export const tableBgColor50 = (day: DayType) => {
  return clsx({
    "bg-day-sun-50": day == DayType.Sun,
    "bg-day-mon-50": day == DayType.Mon,
    "bg-day-tue-50": day == DayType.Tue,
    "bg-day-wed-50": day == DayType.Wed,
    "bg-day-thu-50": day == DayType.Thu,
    "bg-day-fri-50": day == DayType.Fri,
    "bg-day-sat-50": day == DayType.Sat,
    "bg-neutral-grey-200": day == DayType.None,
  });
};

export const tableBgColor100 = (day: DayType) => {
  return clsx({
    "bg-day-sun-100": day == DayType.Sun,
    "bg-day-mon-100": day == DayType.Mon,
    "bg-day-tue-100": day == DayType.Tue,
    "bg-day-wed-100": day == DayType.Wed,
    "bg-day-thu-100": day == DayType.Thu,
    "bg-day-fri-100": day == DayType.Fri,
    "bg-day-sat-100": day == DayType.Sat,
    "bg-neutral-grey-200": day == DayType.None,
  });
};

export const hoverTableBgColor100 = (day: DayType) => {
  return clsx({
    "hover:bg-day-sun-100": day == DayType.Sun,
    "hover:bg-day-mon-100": day == DayType.Mon,
    "hover:bg-day-tue-100": day == DayType.Tue,
    "hover:bg-day-wed-100": day == DayType.Wed,
    "hover:bg-day-thu-100": day == DayType.Thu,
    "hover:bg-day-fri-100": day == DayType.Fri,
    "hover:bg-day-sat-100": day == DayType.Sat,
    "hover:bg-neutral-grey-300": day == DayType.None,
  });
};

export const tableBgColor500 = (day: DayType) => {
  return clsx({
    "bg-day-sun-500": day == DayType.Sun,
    "bg-day-mon-500": day == DayType.Mon,
    "bg-day-tue-500": day == DayType.Tue,
    "bg-day-wed-500": day == DayType.Wed,
    "bg-day-thu-500": day == DayType.Thu,
    "bg-day-fri-500": day == DayType.Fri,
    "bg-day-sat-500": day == DayType.Sat,
    "bg-neutral-grey-500": day == DayType.None,
  });
};

export const hoverTableBgColor500 = (day: DayType) => {
  return clsx({
    "hover:bg-day-sun-500": day == DayType.Sun,
    "hover:bg-day-mon-500": day == DayType.Mon,
    "hover:bg-day-tue-500": day == DayType.Tue,
    "hover:bg-day-wed-500": day == DayType.Wed,
    "hover:bg-day-thu-500": day == DayType.Thu,
    "hover:bg-day-fri-500": day == DayType.Fri,
    "hover:bg-day-sat-500": day == DayType.Sat,
    "hover:bg-neutral-grey-500": day == DayType.None,
  });
};

export default function TableDayHeader({
  day,
  isStart,
  isEnd,
}: {
  day: DayType;
  isStart?: boolean;
  isEnd?: boolean;
}) {
  return (
    <div
      className={clsx(
        "w-full h-[95px] flex justify-center items-center font-bold text-base lg:text-xl",
        {
          "rounded-bl-md": isEnd,
        },
        tableBgColor500(day)
      )}>
      {day != DayType.None ? day.toUpperCase() : "ETC"}
    </div>
  );
}
