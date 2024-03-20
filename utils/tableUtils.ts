import { DayType, SectionType, StdStatus } from "@/constants/enum";
import {
  ChoiceOfSection,
  isSectionInSectionCodeAndType,
  sectionCodeAndType,
} from "@/interface/ChoiceOfSection";
import { TableSection, sectionToTableSection } from "@/interface/TableSection";
import { Section } from "@/model/section";
import { Session } from "next-auth";
import { checkMajorCodeCanEnroll } from "./subjectUtils";

export function checkTimeOverlap({
  baseSection,
  checkSection,
}: {
  baseSection: Section;
  checkSection: Section;
}) {
  // console.log("checkTimeOverlap");
  for (const baseSectionCoursedate of baseSection.coursedate ?? []) {
    for (const checkSectionCoursedate of checkSection.coursedate ?? []) {
      if (baseSectionCoursedate.day == checkSectionCoursedate.day) {
        const baseSectionCoursedateStartTime =
          (baseSectionCoursedate.timeRange?.startHour ?? 0) * 100 +
          (baseSectionCoursedate.timeRange?.startMinute ?? 0);
        const baseSectionCoursedateEndTime =
          (baseSectionCoursedate.timeRange?.endHour ?? 0) * 100 +
          (baseSectionCoursedate.timeRange?.endMinute ?? 0);
        const checkSectionCoursedateStartTime =
          (checkSectionCoursedate.timeRange?.startHour ?? 0) * 100 +
          (checkSectionCoursedate.timeRange?.startMinute ?? 0);
        const checkSectionCoursedateEndTime =
          (checkSectionCoursedate.timeRange?.endHour ?? 0) * 100 +
          (checkSectionCoursedate.timeRange?.endMinute ?? 0);
        // console.log(
        //   baseSectionCoursedateStartTime,
        //   baseSectionCoursedateEndTime,
        //   checkSectionCoursedateStartTime,
        //   checkSectionCoursedateEndTime
        // );
        if (
          checkSectionCoursedateStartTime >= baseSectionCoursedateStartTime &&
          checkSectionCoursedateStartTime >= baseSectionCoursedateEndTime
        ) {
          // not overlap
        } else if (
          checkSectionCoursedateEndTime <= baseSectionCoursedateStartTime &&
          checkSectionCoursedateEndTime <= baseSectionCoursedateEndTime
        ) {
          // not overlap
        } else {
          // overlap
          return true;
        }
      }
    }
  }
  return false;
}

export function checkAllTimeOverlap({
  nowArrayOfChoiceOfSection,
  chooseSection,
}: {
  nowArrayOfChoiceOfSection: Array<Array<Section | undefined>>;
  chooseSection: Section;
}) {
  for (const choiceOfSection of nowArrayOfChoiceOfSection) {
    for (const section of choiceOfSection) {
      if (
        section != null &&
        section != undefined &&
        checkTimeOverlap({
          baseSection: section,
          checkSection: chooseSection,
        })
      ) {
        // overlap
        return true;
      }
    }
  }
  // not overlap
  return false;
}

export function findPairSection({
  chooseSectionData,
  chooseSection,
}: {
  chooseSectionData: Array<Section>;
  chooseSection: Section;
}) {
  for (const section of chooseSectionData) {
    if (section.sectionType != chooseSection.sectionType) {
      if (chooseSection.sectionCode == section.sectionCode) {
        return section;
      } else if (`1${chooseSection.sectionCode}` == section.sectionCode) {
        return section;
      } else if (`1${section.sectionCode}` == chooseSection.sectionCode) {
        return section;
      }
    }
  }
  return null;
}

export function chooseSection({
  orderSections,
  nowArrayOfChoiceOfSection,
  nowChoiceIndex,
  finalArrayOfChoiceOfSection,
  session,
  selectedStdStatus,
}: {
  orderSections: Array<Array<Section>>;
  nowArrayOfChoiceOfSection: Array<Array<Section>>;
  nowChoiceIndex: number;
  finalArrayOfChoiceOfSection: Array<ChoiceOfSection>;
  session: Session | null;
  selectedStdStatus: StdStatus | null;
}) {
  // console.log("chooseSection", nowArrayOfChoiceOfSection);
  if (nowChoiceIndex == orderSections.length) {
    // console.log(
    //   arrayOfChooseSection.map((section) => {
    //     return section?.sectionCode ?? "";
    //   })
    // );
    finalArrayOfChoiceOfSection.push({
      array: nowArrayOfChoiceOfSection.map((choiceOfSection) => {
        return choiceOfSection.map((section) => {
          return {
            sectionCode: section.sectionCode,
            type: section.sectionType,
          } as sectionCodeAndType;
        });
      }),
      length: nowArrayOfChoiceOfSection.filter(
        (choiceOfSection) => choiceOfSection.length != 0
      ).length,
    });
    // console.log(nowChoiceIndex, finalArrayOfChoiceOfSection);

    return;
  }
  for (const section of orderSections[nowChoiceIndex]) {
    if (
      !checkMajorCodeCanEnroll({
        section: section,
        stdStatus: selectedStdStatus,
        session: session,
      }) ||
      checkAllTimeOverlap({
        nowArrayOfChoiceOfSection: nowArrayOfChoiceOfSection,
        chooseSection: section,
      })
    ) {
      // overlap
    } else {
      const pairSection = findPairSection({
        chooseSection: section,
        chooseSectionData: orderSections[nowChoiceIndex],
      });
      if (pairSection?.sectionType == SectionType.Lecture) {
        // will choose pair section only start with Lecture
        // not choose Lecture section to pair section because it will same pattern
        continue;
      }
      if (pairSection) {
        if (
          checkAllTimeOverlap({
            nowArrayOfChoiceOfSection: nowArrayOfChoiceOfSection,
            chooseSection: pairSection,
          })
        ) {
          // overlap
        } else {
          chooseSection({
            orderSections: orderSections,
            nowArrayOfChoiceOfSection: [
              ...nowArrayOfChoiceOfSection,
              [section, pairSection],
            ],
            nowChoiceIndex: nowChoiceIndex + 1,
            finalArrayOfChoiceOfSection: finalArrayOfChoiceOfSection,
            session: session,
            selectedStdStatus: selectedStdStatus,
          });
        }
      } else {
        chooseSection({
          orderSections: orderSections,
          nowArrayOfChoiceOfSection: [...nowArrayOfChoiceOfSection, [section]],
          nowChoiceIndex: nowChoiceIndex + 1,
          finalArrayOfChoiceOfSection: finalArrayOfChoiceOfSection,
          session: session,
          selectedStdStatus: selectedStdStatus,
        });
      }
    }
  }
  chooseSection({
    orderSections: orderSections,
    nowArrayOfChoiceOfSection: [...nowArrayOfChoiceOfSection, []],
    nowChoiceIndex: nowChoiceIndex + 1,
    finalArrayOfChoiceOfSection: finalArrayOfChoiceOfSection,
    session: session,
    selectedStdStatus: selectedStdStatus,
  });
}

export function getArrayOfChoiceOfSection({
  orderSections,
  maxChoice,
  session,
  selectedStdStatus,
}: {
  orderSections: Array<Array<Section>>;
  maxChoice?: number;
  session: Session | null;
  selectedStdStatus: StdStatus | null;
}) {
  let arrayOfChoiceOfSection: Array<ChoiceOfSection> = [];
  chooseSection({
    orderSections: orderSections,
    nowArrayOfChoiceOfSection: [],
    nowChoiceIndex: 0,
    finalArrayOfChoiceOfSection: arrayOfChoiceOfSection,
    session: session,
    selectedStdStatus: selectedStdStatus,
  });
  // console.log(arrayOfChoiceOfSection);
  const sortedArrayOfChoiceOfSection = arrayOfChoiceOfSection
    .sort(function (a, b) {
      return b.length - a.length;
    })
    // .filter((sectionCode) => {
    //   return sectionCode.length == arrayOfChoiceOfSection[0].length;
    // })
    .slice(
      0,
      maxChoice && maxChoice < arrayOfChoiceOfSection.length
        ? maxChoice
        : arrayOfChoiceOfSection.length
    );
  // console.log(sortedArrayOfChoiceOfSection, 0, maxChoice ?? 10);
  return sortedArrayOfChoiceOfSection;
}

export function getMapTableSectionOfChoiceOfSection({
  orderSections,
  choiceOfSection,
}: {
  orderSections: Array<Array<Section>>;
  choiceOfSection: ChoiceOfSection;
}) {
  const mapChoiceOfSection = new Map<DayType, Array<TableSection>>([
    [DayType.Sun, []],
    [DayType.Mon, []],
    [DayType.Tue, []],
    [DayType.Wed, []],
    [DayType.Thu, []],
    [DayType.Fri, []],
    [DayType.Sat, []],
    [DayType.None, []],
  ]);
  let index = 0;
  for (const sections of orderSections) {
    for (const section of sections) {
      if (
        section?.sectionCode &&
        isSectionInSectionCodeAndType({
          section: section,
          nowChooseSecs: choiceOfSection.array[index],
        })
      ) {
        if (section?.coursedate) {
          for (const courseDate of section?.coursedate) {
            mapChoiceOfSection
              .get(courseDate.day)!
              .push(sectionToTableSection(section, courseDate));
          }
        }
      }
    }
    index++;
  }
  return mapChoiceOfSection;
}

export function setOfAllTimeOverlap({
  nowArrayOfChoiceOfSection,
  chooseSection,
}: {
  nowArrayOfChoiceOfSection: Array<Array<Section | undefined>>;
  chooseSection: Section;
}) {
  const sectionNameTimeOverlap: Array<string> = [];
  for (const choiceOfSection of nowArrayOfChoiceOfSection) {
    // console.log(choiceOfSection[0]?.subjectCode, choiceOfSection);
    for (const section of choiceOfSection) {
      // console.log(
      //   "check overlap X",
      //   section?.subjectCode,
      //   section?.sectionCode,
      //   chooseSection.sectionCode,
      //   section?.sectionType,
      //   chooseSection.sectionType,
      //   section?.coursedate,
      //   chooseSection.coursedate,
      //   section?.sectionType,
      //   section &&
      //     checkTimeOverlap({
      //       baseSection: section,
      //       checkSection: chooseSection,
      //     })
      // );

      if (
        section != null &&
        section != undefined &&
        section.subjectCode != chooseSection.subjectCode &&
        checkTimeOverlap({
          baseSection: section,
          checkSection: chooseSection,
        })
      ) {
        // overlap
        // console.log(section.subjectCode, "overlap 1");
        sectionNameTimeOverlap.push(section.subjectCode ?? "");
        break;
      } else if (
        section != null &&
        section != undefined &&
        section.subjectCode == chooseSection.subjectCode &&
        section.sectionType != chooseSection.sectionType &&
        checkTimeOverlap({
          baseSection: section,
          checkSection: chooseSection,
        })
      ) {
        // overlap
        // console.log(section.subjectCode, "overlap 2");
        sectionNameTimeOverlap.push(section.subjectCode ?? "");
        break;
      }
      // console.log(section?.subjectCode, "overlap none");
    }
  }
  return sectionNameTimeOverlap;
}

export const tableColunmWidth = (isFirst?: boolean) => {
  if (isFirst) {
    return 72;
  }
  return 98;
};

export function indexChoiceOfSectionDBInChoiceOfSections(
  choiceOfSectionDB: ChoiceOfSection,
  choiceOfSections: Array<ChoiceOfSection>
) {
  for (let c = 0; c < choiceOfSections.length; c++) {
    // console.log(`--------------${c}------------------`);s
    if (
      choiceOfSections[c].length != choiceOfSectionDB.length ||
      choiceOfSections[c].array.length != choiceOfSectionDB.array.length
    ) {
      continue;
    }
    const dbArray = choiceOfSectionDB.array;
    const array = choiceOfSections[c].array;
    let isAllEq = true;
    // console.log(dbArray, array);
    for (let i = 0; i < dbArray.length; i++) {
      const secs = array[i]
        .map((a) => a.sectionCode)
        .sort()
        .join(",");
      const secsDB = dbArray[i]
        .map((a) => a.sectionCode)
        .sort()
        .join(",");
      // console.log(secs, secsDB);
      if (secs !== secsDB) {
        isAllEq = false;
        break;
      }
    }
    if (isAllEq) {
      return c;
    }
  }
  return -1;
}
