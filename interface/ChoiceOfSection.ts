import { SectionType } from "@/constants/enum";
import { Section } from "@/model/section";

export interface ChoiceOfSection {
  array: Array<Array<sectionCodeAndType>>;
  length: number;
}

export interface sectionCodeAndType {
  sectionCode: string;
  type?: SectionType;
}

export function choiceOfSectionToString(choiceOfSection: ChoiceOfSection) {
  return choiceOfSection.array.map((sectionsCodeAndType) =>
    sectionsCodeAndType.map(
      (sectionCodeAndType) => sectionCodeAndType.sectionCode
    )
  );
}

export function sectionsCodeAndTypeToString(
  sectionsCodeAndType: Array<sectionCodeAndType>
) {
  return sectionsCodeAndType.map(
    (sectionCodeAndType) => sectionCodeAndType.sectionCode
  );
}

export function isSectionInSectionCodeAndType({
  section,
  nowChooseSecs,
}: {
  section: Section;
  nowChooseSecs: Array<sectionCodeAndType>;
}) {
  return nowChooseSecs
    .map((sectionCodeAndType) => JSON.stringify(sectionCodeAndType))
    .includes(
      JSON.stringify({
        sectionCode: section.sectionCode ?? "",
        type: section.sectionType,
      })
    );
}
