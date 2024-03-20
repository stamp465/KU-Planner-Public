"use client";

import { useTranslations } from "next-intl";
import NameComponent from "./NameComponent";
import { NameComponentType } from "@/constants/enum";
import { useState } from "react";
import clsx from "clsx";
import { useAtom } from "jotai";
import { allSubjectsAtom } from "@/atom/allSubjectsAtom";
import { favoriteSubjectsAtom } from "@/atom/favoriteSubjectsAtom";
import { orderSubjectsAtom } from "@/atom/orderSubjectsAtom";

export default function FavoriteNameComponent() {
  const [allSubjects] = useAtom(allSubjectsAtom);
  const [favoriteSubjects, setFavoriteSubjects] = useAtom(favoriteSubjectsAtom);
  const [orderSubjects, setOrderSubjects] = useAtom(orderSubjectsAtom);
  const tSelectedPage = useTranslations("SelectedPage");
  const nowFavoriteSubjects = allSubjects.filter((subject) =>
    favoriteSubjects.includes(subject.subjectCode)
  );
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const bgAndBorder = clsx({
    "border-2 border-accent-warning  bg-neutral-white":
      nowFavoriteSubjects.length != 0,
    "bg-accent-warning-light": !isCollapse || nowFavoriteSubjects.length == 0,
  });

  return (
    <div className=" w-full">
      <div className="">
        <div
          className={clsx(
            "text-base text-accent-warning-dark font-bold rounded",
            bgAndBorder
          )}>
          <div className="py-2 px-3  flex flex-row justify-between items-center">
            {tSelectedPage("FavoriteSubjectsTitle")}
            {nowFavoriteSubjects.length != 0 ? (
              <div className="text-xs w-5 h-5 rounded-full bg-accent-warning-dark flex items-center justify-center text-neutral-white">
                {nowFavoriteSubjects.length}
              </div>
            ) : (
              <div className=" font-normal text-sm">
                {tSelectedPage("NoOldSearchSubjectsTitle")}
              </div>
            )}
          </div>
        </div>
        <div className="">
          {nowFavoriteSubjects.map((subject) => (
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
                setFavoriteSubjects(
                  favoriteSubjects.filter((s) => s !== subject.subjectCode)
                );
                setOrderSubjects(
                  orderSubjects.filter((s) => s !== subject.subjectCode)
                );
              }}
              isChoose={orderSubjects.includes(subject.subjectCode)}
              backgroundColor="bg-accent-warning-light"
              type={NameComponentType.Search}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
