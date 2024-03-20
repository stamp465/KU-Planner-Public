"use client";

import Button from "../Button";
import { ButtonType, ButtonWidth } from "@/constants/enum";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import SelectedStdStatusDropDown from "./SelectedStdStatusDropDown";
import { useAtom } from "jotai";
import { selectedPageAtom } from "@/atom/selectedPageAtom";
import { selectedChoiceOfSectionAtom } from "@/atom/selectedChoiceOfSectionAtom";
import { useState, useEffect } from "react";
import { choiceOfSectionDBAtom } from "@/atom/choiceOfSectionsDBAtom";
import HowToUseModal from "./HowToUseModal";

export default function SelectedSubjectsButton() {
  const [selectedPage, setSelectedPage] = useAtom(selectedPageAtom);
  const [selectedChoiceOfSection, setSelectedChoiceOfSection] = useAtom(
    selectedChoiceOfSectionAtom
  );
  const [choiceOfSectionDB, setChoiceOfSectionDB] = useAtom(
    choiceOfSectionDBAtom
  );

  const tCommon = useTranslations("Common");
  const router = useRouter();
  const tSelectedPage = useTranslations("SelectedPage");
  const [isLoading, setIsLoading] = useState(false);
  let timeOuts: (string | number | NodeJS.Timeout | undefined)[] = [];

  useEffect(() => {
    if (isLoading) {
      const newTimeOut = setTimeout(() => {
        setIsLoading((prev) => false);
      }, 5000);
      timeOuts.push(newTimeOut);
    } else {
      for (var i = 0; i < timeOuts.length; i++) {
        clearTimeout(timeOuts[i]);
      }
      timeOuts = [];
    }
  }, [isLoading]);

  return (
    <div className=" w-full flex flex-row items-center justify-between gap-y-2">
      <div className="flex gap-2 flex-col items-start xs:flex-row xs:items-center ">
        <div className="text-2xl font-bold text-primary-green-900">
          {tSelectedPage("Title")}
        </div>
        <SelectedStdStatusDropDown />
      </div>
      <div className="flex items-center gap-2">
        <HowToUseModal />
        {isLoading ? (
          <Button
            type={ButtonType.Disable}
            width={ButtonWidth.NotExpand}>
            {
              <span className="loading loading-dots loading-md text-neutral-white"></span>
            }
          </Button>
        ) : (
          <Button
            type={ButtonType.Normal}
            width={ButtonWidth.Short}
            text={tCommon("Next")}
            onClick={async () => {
              setIsLoading((prev) => true);
              setSelectedPage(2);
              if (choiceOfSectionDB == null) {
                setSelectedChoiceOfSection(null);
              }
              router.push("/table");
            }}
          />
        )}
      </div>
    </div>
  );
}
