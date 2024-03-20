"use client";

import { useTranslations } from "next-intl";
import NameComponent from "./NameComponent";
import { NameComponentType } from "@/constants/enum";
import clsx from "clsx";
import { useAtom } from "jotai";
import { allSubjectsAtom } from "@/atom/allSubjectsAtom";
import { orderSubjectsAtom } from "@/atom/orderSubjectsAtom";
import { searchSubjectsAtom } from "@/atom/searchSubjectsAtom";

export default function SearchNameComponent() {
  const [allSubjects] = useAtom(allSubjectsAtom);
  const [orderSubjects, setOrderSubjects] = useAtom(orderSubjectsAtom);
  const [searchSubjects, setSearchSubjects] = useAtom(searchSubjectsAtom);
  const tSelectedPage = useTranslations("SelectedPage");
  const nowSeacrchSubjects = allSubjects.filter((subject) =>
    searchSubjects.includes(subject.subjectCode)
  );
  const bgAndBorder = clsx({
    "border-2 border-accent-info  bg-neutral-white":
      nowSeacrchSubjects.length != 0,
    "bg-accent-info-light": nowSeacrchSubjects.length == 0,
  });

  return (
    <div className=" w-full">
      <div
        className={clsx(
          "text-base text-accent-info-dark font-bold rounded",
          bgAndBorder
        )}>
        <div className="py-2 px-3 flex flex-row justify-between items-center ">
          {tSelectedPage("OldSearchSubjectsTitle")}
          {nowSeacrchSubjects.length != 0 ? (
            <div className="text-xs w-5 h-5 rounded-full bg-accent-info-dark flex items-center justify-center text-neutral-white">
              {nowSeacrchSubjects.length}
            </div>
          ) : (
            <div className=" font-normal text-sm">
              {tSelectedPage("NoOldSearchSubjectsTitle")}
            </div>
          )}
        </div>
      </div>
      <div className="">
        {nowSeacrchSubjects.map((subject) => (
          <NameComponent
            key={subject.subjectCode}
            subject={subject}
            onChoose={() => {
              setOrderSubjects([...orderSubjects, subject.subjectCode]);
            }}
            onUnChoose={() => {
              setOrderSubjects(
                orderSubjects.filter((s) => s !== subject.subjectCode)
              );
            }}
            onDelete={() => {
              setOrderSubjects(
                orderSubjects.filter((s) => s !== subject.subjectCode)
              );
              setSearchSubjects(
                searchSubjects.filter((s) => s !== subject.subjectCode)
              );
            }}
            isChoose={orderSubjects.includes(subject.subjectCode)}
            backgroundColor="bg-accent-info-light"
            type={NameComponentType.Search}
          />
        ))}
      </div>
    </div>
  );
}
