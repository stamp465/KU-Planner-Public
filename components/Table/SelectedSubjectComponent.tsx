import { Section } from "@/model/section";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import ChangeSectionModal from "./ChangeSectionModal";
import { sectionCodeAndType } from "@/interface/ChoiceOfSection";
import { useState } from "react";
import { favoriteSubjectsAtom } from "@/atom/favoriteSubjectsAtom";
import { useAtom } from "jotai";
import { choiceOfSectionsAtom } from "@/atom/choiceOfSectionsAtom";
import { selectedChoiceOfSectionAtom } from "@/atom/selectedChoiceOfSectionAtom";
import LikeButton from "../Subject/LikeButton";

export default function SelectedSubjectComponent({
  sectionsData,
  chooseSecs,
  nowIndex,
}: {
  sectionsData: Array<Section>;
  chooseSecs: Array<sectionCodeAndType>;
  nowIndex: number;
}) {
  const section = sectionsData[0];
  const [favoriteSubjects, setFavoriteSubjects] = useAtom(favoriteSubjectsAtom);
  const tTablePage = useTranslations("TablePage");
  const isSelected = chooseSecs.length != 0;
  const borderColor = clsx({
    "border border-primary-green-500": isSelected,
    "border border-neutral-grey-200": !isSelected,
  });
  const [modal, setModal] = useState(false);

  const [selectedChoiceOfSection, setSelectedChoiceOfSection] = useAtom(
    selectedChoiceOfSectionAtom
  );
  const [choiceOfSections, setChoiceOfSections] = useAtom(choiceOfSectionsAtom);

  const SectionNumber = ({ sec }: { sec: sectionCodeAndType }) => {
    return (
      <div className=" rounded bg-primary-green-25 h-6 min-w-6 px-2 flex justify-center items-center">
        {sec.sectionCode}
      </div>
    );
  };

  return (
    <div
      className={clsx(
        borderColor,
        "rounded p-3 ",
        "flex justify-between w-full flex-wrap items-center gap-2",
        "text-primary-green-900"
      )}>
      <div className="text-base font-bold  flex flex-wrap gap-x-2">
        {section.subjectCode ? (
          <LikeButton subjectCode={section.subjectCode} />
        ) : (
          <></>
        )}
        <div>{`${section.subjectCode} `}</div>
        <div>{`${section.subjectNameTh}`}</div>

        <div className=" font-normal">
          {isSelected ? (
            <>
              <div className="text-base flex items-center gap-x-1">
                <div>{tTablePage("SelectedSection")}</div>
                {chooseSecs.map((chooseSec, index) => {
                  return (
                    <SectionNumber
                      key={`SectionNumber${section.sectionCode}${index}`}
                      sec={chooseSec}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="text-base flex items-center gap-x-1">
                <div>{tTablePage("NotChooseSection")}</div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className=" self-center">
        <div className=" flex gap-2">
          {chooseSecs.length != 0 ? (
            <button
              className="text-sm font-bold text-primary-green-900 hover:underline self-end bg-neutral-grey-100 rounded py-1 px-2"
              onClick={() => {
                const newChoiceOfSection = choiceOfSections[
                  selectedChoiceOfSection ?? 0
                ].array.map((sectionsCodeAndType, index) =>
                  index == nowIndex ? [] : sectionsCodeAndType
                );
                const newChoiceOfSections = [
                  ...choiceOfSections.slice(0, 8),
                  {
                    array: newChoiceOfSection,
                    length: newChoiceOfSection.length,
                  },
                ];
                // console.log("newChoiceOfSections", newChoiceOfSections);
                setChoiceOfSections(newChoiceOfSections);
                setSelectedChoiceOfSection(newChoiceOfSections.length - 1);
              }}>
              {tTablePage("NotChooseSection")}
            </button>
          ) : (
            <></>
          )}
          <button
            className="text-sm font-bold text-primary-green-900 hover:underline self-end bg-primary-green-50 rounded py-1 px-2"
            onClick={() => setModal(true)}>
            {chooseSecs.length == 0
              ? tTablePage("ChooseSection")
              : tTablePage("ChangeSection")}
          </button>
        </div>
        <ChangeSectionModal
          sectionsData={sectionsData}
          chooseSecs={chooseSecs}
          nowIndex={nowIndex}
          modal={modal}
          setModal={setModal}
        />
      </div>
    </div>
  );
}
