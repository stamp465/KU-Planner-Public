"use client";

import { useState } from "react";
import Button from "../Button";
import { ButtonType, ButtonWidth } from "@/constants/enum";
import { useTranslations } from "next-intl";
import PureModal from "@/plugins/pureModal/react-pure-modal";
import {
  ChoiceOfSection,
  choiceOfSectionToString,
} from "@/interface/ChoiceOfSection";
import PlanComponent from "./PlanComponent";
import { choiceOfSectionsAtom } from "@/atom/choiceOfSectionsAtom";
import { selectedChoiceOfSectionAtom } from "@/atom/selectedChoiceOfSectionAtom";
import { tableSubjectsAtom } from "@/atom/tableSubjectsAtom";
import { useAtom } from "jotai";
import { LuFolderSearch } from "react-icons/lu";

export default function ChangePlanModal() {
  const [modal, setModal] = useState(false);
  const [selectedChoiceOfSection, setSelectedChoiceOfSection] = useAtom(
    selectedChoiceOfSectionAtom
  );
  const [choiceOfSections] = useAtom(choiceOfSectionsAtom);
  const [tableSubjects] = useAtom(tableSubjectsAtom);
  const tTablePage = useTranslations("TablePage");
  const tCommon = useTranslations("Common");
  const [nowSelected, setNowSelected] = useState<number>(
    selectedChoiceOfSection ?? 0
  );

  // console.log(arrayOfChoiceOfSection);
  return (
    <>
      <Button
        type={ButtonType.Normal}
        width={ButtonWidth.NotExpand}
        bgColor="bg-secondary-blue-700 hover:bg-secondary-blue-500"
        onClick={async () => {
          setModal(true);
          setNowSelected(selectedChoiceOfSection ?? 0);
        }}>
        <div className="flex gap-1 text-neutral-white font-bold items-center">
          <div className="text-xs sm:text-base">{tTablePage("ChangePlan")}</div>
          <LuFolderSearch />
        </div>
      </Button>
      <PureModal
        isOpen={modal}
        closeButton={
          <button className="btn btn-sm btn-circle btn-ghost">✕</button>
        }
        onClose={() => {
          setModal(false);
          return true;
        }}
        width="100%"
        maxWidth="768px">
        <div
          className="text-primary-green-900 flex flex-col gap-3 justify-between max-h-[80vh] max-w-[720px]"
          id={`plan_modal`}>
          <h3 className="font-bold text-xl">{tTablePage("ChangePlan")}</h3>
          <div className="max-h-full overflow-y-auto">
            <div className="flex flex-col gap-3">
              {choiceOfSections.map((choiceOfSection, index) => {
                return (
                  <div key={`PlanComponent ${index}`}>
                    <PlanComponent
                      choiceOfSection={choiceOfSectionToString(choiceOfSection)}
                      tableSubjects={tableSubjects}
                      isSelected={index === nowSelected}
                      index={index}
                      onSelected={setNowSelected}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            type={ButtonType.Normal}
            width={ButtonWidth.Expand}
            onClick={async () => {
              setSelectedChoiceOfSection(nowSelected);
              setModal(false);
            }}
            text={tCommon("Confirm")}></Button>
        </div>
      </PureModal>
    </>
  );
}
