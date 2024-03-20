"use client";

import { choiceOfSectionsAtom } from "@/atom/choiceOfSectionsAtom";
import { selectedChoiceOfSectionAtom } from "@/atom/selectedChoiceOfSectionAtom";
import { tableSubjectsAtom } from "@/atom/tableSubjectsAtom";
import { useAtom } from "jotai";
import SelectedSubjectComponent from "./SelectedSubjectComponent";
import clsx from "clsx";
import LikeButton from "../Subject/LikeButton";

export default function SelectedSubjects() {
  const [selectedChoiceOfSection, setSelectedChoiceOfSection] = useAtom(
    selectedChoiceOfSectionAtom
  );
  const [choiceOfSections, setChoiceOfSections] = useAtom(choiceOfSectionsAtom);
  const [tableSubjects, setTableSubjects] = useAtom(tableSubjectsAtom);

  return (
    <>
      {tableSubjects.map((subject, index) => {
        if (subject == null || subject.section.length == 0) {
          return (
            <div
              key={`${index} ${"no_data"} ${subject && subject.subjectCode}`}
              className={clsx(
                "border border-neutral-grey-200 rounded p-3",
                "flex justify-between w-full flex-wrap items-center gap-2",
                "text-primary-green-900"
              )}>
              <div className="text-base font-bold  flex flex-wrap gap-x-2">
                {subject && subject.subjectCode ? (
                  <LikeButton subjectCode={subject.subjectCode} />
                ) : (
                  <></>
                )}
                <div>{`${subject && subject.subjectCode} `}</div>
              </div>
              <div className=" self-center ml-auto">
                <div className=" font-normal text-neutral-grey-400">
                  {`ไม่พบข้อมูลรายวิชา`}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div
            className={clsx(" w-full")}
            key={`${index} ${subject.subjectCode}`}>
            <SelectedSubjectComponent
              nowIndex={index}
              sectionsData={subject.section}
              chooseSecs={
                choiceOfSections[selectedChoiceOfSection ?? 0].array[index]
              }
            />
          </div>
        );
      })}
    </>
  );
}
