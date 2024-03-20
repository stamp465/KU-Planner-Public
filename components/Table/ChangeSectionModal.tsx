"use client";

import {
  ButtonType,
  ButtonWidth,
  SectionType,
  StdStatus,
} from "@/constants/enum";
import Button from "@/components/Button";
import { Subject } from "@/model/subject";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  openSubjectForEnroll,
  searchSectionDetail,
  subjects,
} from "@/constants/path";
import { Section } from "@/model/section";
import PureModal from "@/plugins/pureModal/react-pure-modal";
import SectionComponent from "../Section/SectionComponent";
import { SectionGroupByStdStatus } from "@/interface/SectionGroupByStdStatus";
import { getSubjectLocal } from "@/utils/subjectUtils";
import {
  isSectionInSectionCodeAndType,
  sectionCodeAndType,
} from "@/interface/ChoiceOfSection";
import { useAtom } from "jotai";
import { maxGenerateChoicesAtom } from "@/atom/maxGenerateChoicesAtom";
import { choiceOfSectionsAtom } from "@/atom/choiceOfSectionsAtom";
import { selectedChoiceOfSectionAtom } from "@/atom/selectedChoiceOfSectionAtom";
import LikeButton from "../Subject/LikeButton";

export default function ChangeSectionModal({
  sectionsData,
  chooseSecs,
  nowIndex,
  modal,
  setModal,
}: {
  sectionsData: Array<Section>;
  chooseSecs: Array<sectionCodeAndType>;
  nowIndex: number;
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
}) {
  const locale = useLocale();
  const tCommon = useTranslations("Common");
  const tTablePage = useTranslations("TablePage");

  const { data: session, update } = useSession();
  const [sections, setSections] = useState<SectionGroupByStdStatus | null>();
  // const [modal, setModal] = useState(showModal);
  const [isLoading, setIsLoading] = useState(true);
  const [nowChooseSecs, setNowChooseSecs] = useState(chooseSecs);

  const [selectedChoiceOfSection, setSelectedChoiceOfSection] = useAtom(
    selectedChoiceOfSectionAtom
  );
  const [choiceOfSections, setChoiceOfSections] = useAtom(choiceOfSectionsAtom);
  const [maxGenerateChoices, setMaxGenerateChoices] = useAtom(
    maxGenerateChoicesAtom
  );

  async function onChangeSection({
    section,
    subjectsCodeTimeOverlap,
    stdStatusCanEnroll,
  }: {
    section: Section;
    subjectsCodeTimeOverlap: Array<string>;
    stdStatusCanEnroll: boolean;
  }) {
    // console.log("onChangeSection");
    // console.log(section);
    // console.log(nowChooseSecs);
    if (
      section.sectionCode &&
      isSectionInSectionCodeAndType({
        section: section,
        nowChooseSecs: nowChooseSecs,
      })
    ) {
      if (chooseSecs.length == 0) {
        setNowChooseSecs(
          nowChooseSecs.filter((sec) => sec.type != section.sectionType)
        );
      }
    } else {
      if (
        stdStatusCanEnroll &&
        section.sectionCode &&
        subjectsCodeTimeOverlap.length == 0
      ) {
        setNowChooseSecs([
          ...nowChooseSecs.filter((sec) => sec.type != section.sectionType),
          {
            sectionCode: section.sectionCode,
            type: section.sectionType,
          },
        ]);
      }
    }
  }

  function setSectionGroup(
    lectureSection: Array<Section>,
    laboratorySection: Array<Section>
  ) {
    return (
      (lectureSection.length != 0 || laboratorySection.length != 0) && (
        <div className="flex flex-col gap-y-2">
          {lectureSection.map((section) => (
            <SectionComponent
              isLocalData={session?.user ? false : true}
              key={`${section.subjectCode}${section.sectionCode}${section.sectionType}`}
              section={section}
              havePair={false}
              pairSectionCode={"1"}
              isSelected={
                section.sectionCode != undefined &&
                isSectionInSectionCodeAndType({
                  section: section,
                  nowChooseSecs: nowChooseSecs,
                })
              }
              onClick={onChangeSection}></SectionComponent>
          ))}
          {laboratorySection.map((section) => (
            <SectionComponent
              isLocalData={session?.user ? false : true}
              key={`${section.subjectCode}${section.sectionCode}${section.sectionType}`}
              section={section}
              havePair={false}
              pairSectionCode={"1"}
              isSelected={
                section.sectionCode != undefined &&
                isSectionInSectionCodeAndType({
                  section: section,
                  nowChooseSecs: nowChooseSecs,
                })
              }
              onClick={onChangeSection}></SectionComponent>
          ))}
        </div>
      )
    );
  }

  // useEffect(() => {
  //   console.log("nowChooseSecs", nowChooseSecs);
  // }, [nowChooseSecs]);

  useEffect(() => {
    // console.log("-----------change section modal----------");
    // console.log(sectionsData, chooseSecs, nowIndex, modal);
    if (modal == true) {
      setNowChooseSecs(chooseSecs);
      getSubjectLocal({ sections: sectionsData }).then((sectionsMyKU) => {
        // console.log("-----------getSubjectLocal----------", sectionsMyKU);
        setSections(sectionsMyKU);
        setIsLoading(false);
      });
    }
    if (modal == false) {
      setIsLoading(true);
    }
  }, [modal]);

  return (
    <>
      {/* <button
        className="text-sm font-bold text-primary-green-900 hover:underline self-end bg-primary-green-50 rounded py-1 px-2"
        onClick={() => setModal(true)}>
        {tTablePage("ChangeSection")}
      </button> */}
      <PureModal
        isOpen={modal}
        closeButton={
          <button className="btn btn-sm btn-circle btn-ghost">✕</button>
        }
        onClose={() => {
          setModal(false);
          return true;
        }}
        maxWidth="1024px"
        width="100%">
        <div className="text-primary-green-90 flex flex-col gap-3 justify-between max-h-[80vh]">
          <div className="font-bold text-sm xs:text-base md:text-xl flex flex-col sm:flex-row gap-x-2  sm:items-center">
            <div className="flex gap-x-2 ">
              <LikeButton
                subjectCode={
                  sectionsData.length > 0
                    ? sectionsData[0].subjectCode ?? ""
                    : ""
                }
              />
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-x-1">
                <div className="text-base xs:text-xl">
                  {sectionsData.length > 0
                    ? sectionsData[0].subjectCode ?? ""
                    : ""}
                </div>
                <div>
                  {sectionsData.length > 0
                    ? sectionsData[0].subjectNameTh ?? ""
                    : ""}
                </div>
              </div>
              <div className="text-xs xs:text-sm text-accent-error font-medium">
                {`*ถ้ามีวิชาที่ตารางเรียนชน ต้องเปลี่ยนหมู่หรือเลิกลงวิชาเหล่านั้นก่อน เพื่อให้สามารถเลือกลงวิชาที่ต้องการได้`}
              </div>
            </div>
          </div>

          <div className="max-h-full overflow-y-auto">
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <span className="loading loading-dots loading-md"></span>
              </div>
            ) : (
              <div className=" flex flex-col gap-y-2">
                {sections != null ? (
                  <>
                    {setSectionGroup(
                      sections.regular.lecture,
                      sections.regular.laboratory
                    )}
                    {setSectionGroup(
                      sections.regularInternational.lecture,
                      sections.regularInternational.laboratory
                    )}
                    {setSectionGroup(
                      sections.special.lecture,
                      sections.special.laboratory
                    )}
                    {setSectionGroup(
                      sections.specialInternational.lecture,
                      sections.specialInternational.laboratory
                    )}
                  </>
                ) : (
                  <> {tCommon("NotFound")}</>
                )}
              </div>
            )}
          </div>

          <div className="w-full flex gap-2">
            <Button
              type={
                nowChooseSecs.length == 0
                  ? ButtonType.Disable
                  : ButtonType.Normal
              }
              width={ButtonWidth.Expand}
              onClick={async () => {
                const newChoiceOfSection = choiceOfSections[
                  selectedChoiceOfSection ?? 0
                ].array.map((sectionsCodeAndType, index) =>
                  index == nowIndex
                    ? nowChooseSecs.sort((a, b) =>
                        Number(a.sectionCode) < Number(b.sectionCode) ? -1 : 1
                      )
                    : sectionsCodeAndType
                );
                const newChoiceOfSections = [
                  ...choiceOfSections.slice(0, maxGenerateChoices),
                  {
                    array: newChoiceOfSection,
                    length: newChoiceOfSection.length,
                  },
                ];
                // console.log("newChoiceOfSections", newChoiceOfSections);
                setChoiceOfSections(newChoiceOfSections);
                setSelectedChoiceOfSection(newChoiceOfSections.length - 1);
                setModal(false);
              }}
              text={
                chooseSecs.length == 0
                  ? tTablePage("ChooseSection")
                  : tTablePage("ChangeSection")
              }></Button>
            <Button
              type={ButtonType.Outline}
              width={ButtonWidth.Short}
              onClick={async () => {
                const newChoiceOfSection = choiceOfSections[
                  selectedChoiceOfSection ?? 0
                ].array.map((sectionsCodeAndType, index) =>
                  index == nowIndex ? [] : sectionsCodeAndType
                );
                const newChoiceOfSections = [
                  ...choiceOfSections.slice(0, maxGenerateChoices),
                  {
                    array: newChoiceOfSection,
                    length: newChoiceOfSection.length,
                  },
                ];
                // console.log("newChoiceOfSections", newChoiceOfSections);
                setNowChooseSecs([]);
                setChoiceOfSections(newChoiceOfSections);
                setSelectedChoiceOfSection(newChoiceOfSections.length - 1);
                setModal(false);
              }}
              text={tTablePage("NotChooseSection")}></Button>
          </div>
        </div>
      </PureModal>
    </>
  );
}
