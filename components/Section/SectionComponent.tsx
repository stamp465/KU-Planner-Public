import { Section } from "@/model/section";
import { textColor } from "../Chip";
import { DayType, SectionType } from "@/constants/enum";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { setOfAllTimeOverlap } from "@/utils/tableUtils";
import { checkMajorCodeCanEnroll } from "@/utils/subjectUtils";
import { selectedStdStatusAtom } from "@/atom/selectedStdStatusAtom";
import { useAtom } from "jotai";
import { selectedChoiceOfSectionAtom } from "@/atom/selectedChoiceOfSectionAtom";
import { choiceOfSectionsAtom } from "@/atom/choiceOfSectionsAtom";
import { tableSubjectsAtom } from "@/atom/tableSubjectsAtom";
import ErrorChip from "../ErrorChip";

export default function SectionComponent({
  section,
  havePair,
  pairSectionCode,
  isLocalData,
  isSelected,
  checkTable = true,
  onClick,
}: {
  section: Section;
  havePair: boolean;
  pairSectionCode: string;
  isLocalData: boolean;
  isSelected?: boolean;
  checkTable?: boolean;
  onClick?: ({
    section,
    subjectsCodeTimeOverlap,
    stdStatusCanEnroll,
  }: {
    section: Section;
    subjectsCodeTimeOverlap: Array<string>;
    stdStatusCanEnroll: boolean;
  }) => Promise<void>;
}) {
  const { data: session } = useSession();
  const locale = useLocale();
  const tChip = useTranslations("Chip");
  const tCommon = useTranslations("Common");
  const tSubjectsAndSections = useTranslations("SubjectsAndSections");
  const [canEnroll, setCanEnroll] = useState<boolean>(true);
  const [stdStatusCanEnroll, setStdStatusCanEnroll] = useState<boolean>(true);
  const [subjectsCodeTimeOverlap, setSubjectsCodeTimeOverlap] = useState<
    Array<string>
  >([]);
  const [selectedChoiceOfSection] = useAtom(selectedChoiceOfSectionAtom);
  const [choiceOfSections] = useAtom(choiceOfSectionsAtom);
  const [tableSubjects] = useAtom(tableSubjectsAtom);
  const [selectedStdStatus] = useAtom(selectedStdStatusAtom);

  async function checkCanEnrollByTime(section: Section) {
    const nowChoiceOfSections = choiceOfSections[
      selectedChoiceOfSection ?? 0
    ].array.map((sectionsCodeAndType, index) => {
      return sectionsCodeAndType.map((sectionCodeAndType) => {
        return tableSubjects[index]?.section.find(
          (section) =>
            section.sectionCode == sectionCodeAndType.sectionCode &&
            section.sectionType == sectionCodeAndType.type
        );
      });
    });
    // console.log(nowArrayOfChoiceOfSection);
    // console.log(section);
    const allTimeOverlap = setOfAllTimeOverlap({
      nowArrayOfChoiceOfSection: nowChoiceOfSections,
      chooseSection: section,
    });
    if (allTimeOverlap.length != 0) {
      setCanEnroll(isSelected ?? false);
    }
    setSubjectsCodeTimeOverlap(allTimeOverlap);
    // console.log("onChangeSection", isTimeOverlap);
    // if (allTimeOverlap.length == 0) {
    //   console.log("Can change section");
    // } else {
    //   console.log(
    //     "Can't change section",
    //     allTimeOverlap.map((subjectCode) => {
    //       const findSubject = tableSubjects.find(
    //         (subject) => subject?.subjectCode == subjectCode
    //       );
    //       if (findSubject) {
    //         return `${subjectCode} ${findSubject.subjectNameTH}`;
    //       }
    //       return `${subjectCode} ${section}`;
    //     })
    //   );
    // }
  }

  useEffect(() => {
    const isStdStatusCanEnroll = checkMajorCodeCanEnroll({
      section: section,
      stdStatus: selectedStdStatus,
      session: session,
    });
    // console.log(
    //   "isSelected",
    //   section.subjectCode,
    //   section.sectionCode,
    //   isSelected,
    //   isStdStatusCanEnroll
    // );
    setCanEnroll(isStdStatusCanEnroll);
    setStdStatusCanEnroll(isStdStatusCanEnroll);
    if (choiceOfSections.length > 0 && checkTable) {
      checkCanEnrollByTime(section);
    }
  }, []);

  const ErrorText = () => {
    if (isSelected) {
      return <></>;
    }
    const overlapSubjects = subjectsCodeTimeOverlap.map((subjectCode) => {
      const findSubject = tableSubjects.find(
        (subject) => subject?.subjectCode == subjectCode
      );
      if (findSubject) {
        return `${subjectCode} ${findSubject.subjectNameTH}`;
      }
      return `${subjectCode} ${section}`;
    });

    return (
      <div className="px-2 flex h-fit">
        <ErrorChip>
          <div className="">
            <div className="flex xs:flex-col gap-x-1">
              <div className=" whitespace-nowrap">
                {tSubjectsAndSections("CantEnroll")}
              </div>
              <div className=" whitespace-nowrap">
                {!stdStatusCanEnroll
                  ? `เงื่อนไขการลงทะเบียนไม่ถูกต้อง`
                  : overlapSubjects.length != 0 && `ตารางเรียนที่จัดไว้ชนกับ`}
              </div>
            </div>
            {stdStatusCanEnroll &&
              overlapSubjects.length != 0 &&
              overlapSubjects.map((subject) => (
                <div
                  className=" text-xs text-accent-error truncate"
                  key={`OverlapSubjects ${subject}`}>
                  {subject}
                </div>
              ))}
          </div>
        </ErrorChip>
      </div>
    );
  };

  const headerBgColor = clsx({
    "bg-primary-green-10":
      canEnroll && section.sectionType == SectionType.Lecture,
    "bg-secondary-blue-10":
      canEnroll && section.sectionType != SectionType.Lecture,
    "bg-neutral-grey-100": !canEnroll,
  });

  const SectionHeader = () => {
    const sectionTypeColor = clsx({
      "text-primary-green-700": section.sectionType != SectionType.Laboratory,
      "text-secondary-blue-700": section.sectionType == SectionType.Laboratory,
    });
    const sectionBgColor = clsx({
      "bg-primary-green-100":
        canEnroll && section.sectionType == SectionType.Lecture,
      "bg-secondary-blue-100":
        canEnroll && section.sectionType != SectionType.Lecture,
      "bg-neutral-grey-300": !canEnroll,
    });
    const SelectedSection = ({ isXs }: { isXs: boolean }) => {
      const selectedBgColor = clsx({
        "bg-primary-green-50": section.sectionType != SectionType.Laboratory,
        "bg-secondary-blue-50": section.sectionType == SectionType.Laboratory,
      });
      if (isXs) {
        return (
          <div
            className={clsx(
              " absolute flex xs:hidden justify-center text-xs font-bold rounded-b-lg self-start right-2 top-0 px-2 py-1",
              selectedBgColor
            )}>
            {tSubjectsAndSections("Selected")}
          </div>
        );
      }
      return (
        <div
          className={clsx(
            "hidden xs:flex justify-center text-sm font-bold rounded-r-lg py-1 ",
            selectedBgColor
          )}
          style={{ writingMode: "vertical-rl" }}>
          {tSubjectsAndSections("Selected")}
        </div>
      );
    };
    return (
      <div className={clsx("flex gap-x-2 relative")}>
        {isSelected ? <SelectedSection isXs={false} /> : <></>}
        <div
          className={clsx(
            "self-center",
            " w-full xs:w-[96px] xs:h-[96px]  whitespace-nowrap shrink-0"
          )}>
          <div
            className={clsx(
              " py-1 xs:py-0 px-2 xs:px-0",
              " xs:w-full h-full",
              sectionBgColor,
              "  xs:bg-neutral-white",
              "rounded border-0 xs:border xs:border-neutral-black",
              "flex xs:flex-col xs:justify-center items-center justify-start gap-x-2 xs:gap-y-0 gap-y-2"
            )}>
            <div className="flex flex-row gap-x-1 items-center">
              <span className="text-base">
                {tSubjectsAndSections("Section")}
              </span>
              <span className="text-base xs:text-xl font-bold">
                {section.sectionCode ?? "None"}
              </span>
            </div>
            <div className="flex flex-row gap-x-1 items-center text-xs">
              <span className={clsx(sectionTypeColor)}>
                {tChip(section.sectionType)}
              </span>
              <span className=" text-neutral-black">•</span>
              <span className=" text-primary-green-900">
                {tChip(section.stdStatus)}
              </span>
            </div>
          </div>
          {isSelected ? <SelectedSection isXs={true} /> : <></>}
        </div>
      </div>
    );
  };

  const SectionDate = () => {
    return (
      <div className="flex flex-wrap gap-x-2 px-2 h-fit">
        <div className=" text-primary-green-900 text-sm">{`${tSubjectsAndSections(
          "Coursedate"
        )} :`}</div>
        <div className="flex flex-col">
          {section.coursedate?.map((courseDate) => {
            const getTextColor = textColor(courseDate.day);
            if (courseDate.day == DayType.None) {
              return (
                <div
                  key={`${section.subjectCode}${section.sectionCode}${courseDate.day}`}
                  className={`${getTextColor} text-sm`}>
                  {tChip(courseDate.day)}
                </div>
              );
            }
            return (
              <div
                key={`${section.subjectCode}${section.sectionCode}${courseDate.day}`}
                className={`${getTextColor} text-sm`}>{`${tChip(
                courseDate.day
              )} ${courseDate.timeRange?.startHour
                .toString()
                .padStart(2, "0")}:${courseDate.timeRange?.startMinute
                .toString()
                .padStart(2, "0")} - ${courseDate.timeRange?.endHour
                .toString()
                .padStart(2, "0")}:${courseDate.timeRange?.endMinute
                .toString()
                .padStart(2, "0")}`}</div>
            );
          })}
        </div>
      </div>
    );
  };

  const SectionTeacherName = (teacherName: Array<string> | null) => {
    if (teacherName == null || teacherName.length == 0) {
      return <span className=" whitespace-nowrap">{tCommon("NotFound")}</span>;
    } else if (teacherName.length == 1) {
      return <span className=" whitespace-nowrap">{`${teacherName[0]}`}</span>;
    } else if (teacherName.length <= 2) {
      return (
        <div className=" flex flex-wrap">
          <span className=" whitespace-nowrap">{`${teacherName[0]}, `}</span>
          <span className=" whitespace-nowrap">{`${teacherName[1]} `}</span>
        </div>
      );
    }
    return (
      <div className=" flex flex-wrap">
        <span className=" whitespace-nowrap">{`${teacherName[0]}, `}</span>
        <span className=" whitespace-nowrap">{`${teacherName[1]} `}</span>
        <span className=" whitespace-nowrap">{`และอื่นๆ`}</span>
      </div>
    );
  };

  const SectionDetail = () => {
    return (
      <div className="flex flex-col px-2 text-sm">
        <div className="text-primary-green-900">{`${tSubjectsAndSections(
          "Credit"
        )} : ${section.maxCredit} ${tSubjectsAndSections("Credit")}`}</div>
        {!isLocalData ? (
          <>
            <div className="text-primary-green-900 text-sm flex flex-row gap-x-1 ">
              <div className=" shrink-0">{`${tSubjectsAndSections(
                "Teacher"
              )} : `}</div>
              <div className="">
                {SectionTeacherName(
                  locale === "en"
                    ? section.teacherNameEn?.split(",") ?? []
                    : section.teacherName?.split(",") ?? []
                )}
              </div>
            </div>
            <div className="text-primary-green-90">
              {`${tSubjectsAndSections("Room")} : ${
                locale === "en" ? section.roomNameEn : section.roomNameTh
              }`}
            </div>
            {havePair ? (
              <div className=" text-neutral-grey-500 text-sm">
                {`${tSubjectsAndSections("Note")} ${pairSectionCode}`}
              </div>
            ) : (
              <> </>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    );
  };

  const SectionEnroll = () => {
    if (isLocalData) {
      return <></>;
    }
    return (
      <div className="flex flex-col items-center xs:items-end xs:justify-center shrink-0 gap-y-1">
        <div
          className={`p-2 text-sm text-primary-green-900 rounded whitespace-nowrap ${
            canEnroll ? "bg-primary-green-100" : "bg-gray-50"
          }`}>
          {`${section.totalRegistered}/${section.totalSeat}`}
        </div>
        {section.property?.split(",").length == 0 ? (
          <></>
        ) : (
          <span className="text-primary-green-700 text-xs flex flex-wrap justify-end">
            <span className="whitespace-nowrap">{`${tSubjectsAndSections(
              "MajorCode"
            )} : `}</span>
            <span>{SectionTeacherName(section.property?.split(",")!)}</span>
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={clsx(
        " flex flex-col xs:flex-row xs:justify-between rounded",
        headerBgColor,
        {
          "hover:cursor-pointer hover:bg-neutral-grey-200":
            onClick !== undefined && !canEnroll,
          "hover:cursor-pointer hover:bg-primary-green-50":
            onClick !== undefined &&
            canEnroll &&
            section.sectionType == SectionType.Lecture,
          "hover:cursor-pointer hover:bg-secondary-blue-50":
            onClick !== undefined &&
            canEnroll &&
            section.sectionType == SectionType.Laboratory,
        }
      )}
      onClick={async () => {
        onClick &&
          onClick({
            section: section,
            stdStatusCanEnroll: stdStatusCanEnroll,
            subjectsCodeTimeOverlap: subjectsCodeTimeOverlap,
          });
      }}>
      <div className={clsx(" flex flex-col xs:flex-row ")}>
        <SectionHeader />
        <div className={clsx("flex flex-col sm:flex-row py-2")}>
          {!canEnroll ? <ErrorText /> : <></>}
          <div className={clsx(" flex flex-col md:flex-row h-fit")}>
            <SectionDate />
            <SectionDetail />
          </div>
        </div>
      </div>
      <div className="mb-2 xs:mr-2 self-center">
        <SectionEnroll />
      </div>
    </div>
  );
}
