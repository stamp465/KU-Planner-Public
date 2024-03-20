import { ChipType, DayType, SectionType } from "@/constants/enum";
import clsx from "clsx";
import { useTranslations } from "next-intl";

export interface ChipInterface {
  type: ChipType;
  section?: SectionType;
  day?: DayType;
  text?: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  children?: React.ReactNode;
}

export const textColor = (textType: string) => {
  return clsx({
    "text-neutral-black":
      textType == ChipType.Normal || textType == DayType.None,
    "text-day-sun": textType == DayType.Sun,
    "text-day-mon": textType == DayType.Mon,
    "text-day-tue": textType == DayType.Tue,
    "text-day-wed": textType == DayType.Wed,
    "text-day-thu": textType == DayType.Thu,
    "text-day-fri": textType == DayType.Fri,
    "text-day-sat": textType == DayType.Sat,
    "text-secondary-blue-700": textType == SectionType.Laboratory,
    "text-primary-green-700": textType == SectionType.Lecture,
  });
};

export default function Chip({
  type,
  section,
  day,
  text = "chip",
  children,
  textColor,
  bgColor,
  borderColor,
}: ChipInterface) {
  const chipBgColor = (chipBgColorType: string) => {
    return (
      bgColor ??
      clsx("bg-neutral-white", {
        "dark:bg-primary-green-100":
          chipBgColorType == ChipType.Normal ||
          chipBgColorType == SectionType.Lecture,
        "dark:bg-day-sun-100": chipBgColorType == DayType.Sun,
        "dark:bg-day-mon-100": chipBgColorType == DayType.Mon,
        "dark:bg-day-tue-100": chipBgColorType == DayType.Tue,
        "dark:bg-day-wed-100": chipBgColorType == DayType.Wed,
        "dark:bg-day-thu-100": chipBgColorType == DayType.Thu,
        "dark:bg-day-fri-100": chipBgColorType == DayType.Fri,
        "dark:bg-day-sat-100": chipBgColorType == DayType.Sat,
        "dark:bg-secondary-blue-100": chipBgColorType == SectionType.Laboratory,
      })
    );
  };

  const chipBorderColor = (chipBorderColorType: string) => {
    return (
      borderColor ??
      clsx({
        "border-day-sun": chipBorderColorType == DayType.Sun,
        "border-day-mon": chipBorderColorType == DayType.Mon,
        "border-day-tue": chipBorderColorType == DayType.Tue,
        "border-day-wed": chipBorderColorType == DayType.Wed,
        "border-day-thu": chipBorderColorType == DayType.Thu,
        "border-day-fri": chipBorderColorType == DayType.Fri,
        "border-day-sat": chipBorderColorType == DayType.Sat,
        "border-primary-green-700": chipBorderColorType == SectionType.Lecture,
        "border-secondary-blue-700":
          chipBorderColorType == SectionType.Laboratory,
        "border-neutral-black":
          chipBorderColorType == ChipType.Normal ||
          chipBorderColorType == DayType.None,
      })
    );
  };

  const chipTextColor = (chipTextColorType: string) => {
    return (
      textColor ??
      clsx({
        "text-neutral-black": chipTextColorType == ChipType.Normal,
        "text-day-sun dark:text-neutral-black":
          chipTextColorType == DayType.Sun,
        "text-day-mon dark:text-neutral-black":
          chipTextColorType == DayType.Mon,
        "text-day-tue dark:text-neutral-black":
          chipTextColorType == DayType.Tue,
        "text-day-wed dark:text-neutral-black":
          chipTextColorType == DayType.Wed,
        "text-day-thu dark:text-neutral-black":
          chipTextColorType == DayType.Thu,
        "text-day-fri dark:text-neutral-black":
          chipTextColorType == DayType.Fri,
        "text-day-sat dark:text-neutral-black":
          chipTextColorType == DayType.Sat,
        "text-secondary-blue-700 dark:text-neutral-black":
          chipTextColorType == SectionType.Laboratory,
        "text-primary-green-700 dark:text-neutral-black":
          chipTextColorType == SectionType.Lecture,
      })
    );
  };

  const t = useTranslations("Chip");

  //* default chip text style
  const defaultText = (
    <div
      className={clsx(
        chipTextColor(section ?? day ?? ChipType.Normal),
        "text-xs"
      )}>
      {text}
    </div>
  );
  const dayText = (
    <div
      className={clsx(
        chipTextColor(section ?? day ?? ChipType.Normal),
        "text-xs"
      )}>
      {t(day ?? DayType.None)}
    </div>
  );
  const sectionText = (
    <div
      className={clsx(
        chipTextColor(section ?? day ?? ChipType.Normal),
        "text-xs"
      )}>
      {t(section ?? SectionType.Lecture)}
    </div>
  );

  //* set chip text
  function setText() {
    if (type == ChipType.Section) {
      return sectionText;
    } else if (type == ChipType.Day) {
      return dayText;
    } else {
      return defaultText;
    }
  }
  const textInside = setText();

  return (
    <div
      className={clsx(
        "py-[2px] px-3 rounded flex justify-center items-center",
        "border-[3px] dark:border-0 whitespace-nowrap",
        chipBorderColor(section ?? day ?? ChipType.Normal),
        chipBgColor(section ?? day ?? ChipType.Normal)
      )}>
      {children ?? textInside}
    </div>
  );
}
