"use client";

import { useTranslations } from "next-intl";
import NameComponent from "./NameComponent";
import { NameComponentType } from "@/constants/enum";
import clsx from "clsx";
import { useAtom } from "jotai";
import { allSubjectsAtom } from "@/atom/allSubjectsAtom";
import { orderSubjectsAtom } from "@/atom/orderSubjectsAtom";
import { searchSubjectsAtom } from "@/atom/searchSubjectsAtom";
import { StdPlan } from "@/model/stdPlan";

export default function ShouldSelectedNameComponent({
  stdPlans,
}: {
  stdPlans: StdPlan[];
}) {
  // console.log(stdPlans);
  const [allSubjects] = useAtom(allSubjectsAtom);
  const [orderSubjects, setOrderSubjects] = useAtom(orderSubjectsAtom);
  const tSelectedPage = useTranslations("SelectedPage");
  const shouldSelectedSubject = allSubjects.filter((subject) =>
    stdPlans
      .map((stdPlan) => stdPlan.subjectCode)
      .includes(subject.subjectCode.split("-")[0])
  );
  const bgAndBorder = clsx({
    "border-2 border-accent-success  bg-neutral-white":
      shouldSelectedSubject.length != 0,
    "bg-accent-success-light": shouldSelectedSubject.length == 0,
  });

  return (
    <div className=" w-full">
      <div
        className={clsx(
          "text-base text-accent-success-dark font-bold rounded",
          bgAndBorder
        )}>
        <div className="py-2 px-3 flex flex-row justify-between items-center ">
          {tSelectedPage("ShouldEnrollSubjectsTitle")}
          {shouldSelectedSubject.length != 0 ? (
            <div className="text-xs w-5 h-5 rounded-full bg-accent-success-dark flex items-center justify-center text-neutral-white">
              {shouldSelectedSubject.length}
            </div>
          ) : (
            <div className=" font-normal text-sm">
              {tSelectedPage("NoOldSearchSubjectsTitle")}
            </div>
          )}
        </div>
      </div>
      <div className="">
        {shouldSelectedSubject.map((subject) => (
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
            isChoose={orderSubjects.includes(subject.subjectCode)}
            backgroundColor="bg-accent-success-light"
            type={NameComponentType.Search}
          />
        ))}
      </div>
    </div>
  );
}
