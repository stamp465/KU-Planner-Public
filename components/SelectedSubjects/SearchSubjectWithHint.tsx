"use client";

import { Subject } from "@/model/subject";
import TextField from "../TextField";
import { useState } from "react";
import { getListOfSubjectForSearch } from "@/utils/subjectUtils";
import NameComponent from "./NameComponent";
import { NameComponentType } from "@/constants/enum";

import { useAtom } from "jotai";
import { allSubjectsAtom } from "@/atom/allSubjectsAtom";
import { favoriteSubjectsAtom } from "@/atom/favoriteSubjectsAtom";
import { searchSubjectsAtom } from "@/atom/searchSubjectsAtom";

export default function SearchSubjectWithHint() {
  const [allSubjects] = useAtom(allSubjectsAtom);
  const [hintSubjects, setHintSubjects] = useState<Array<Subject>>([]);
  const [favoriteSubjects, setFavoriteSubjects] = useAtom(favoriteSubjectsAtom);
  const [searchSubjects, setSearchSubjects] = useAtom(searchSubjectsAtom);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  return (
    <div className="relative w-full">
      <TextField
        onChange={(text) => {
          setHintSubjects(
            getListOfSubjectForSearch(allSubjects, text, [
              ...favoriteSubjects,
              ...searchSubjects,
            ])
          );
          setSearchText(text);
          setShowHint(true);
        }}
        onClick={() => {
          setHintSubjects(
            getListOfSubjectForSearch(allSubjects, searchText, [
              ...favoriteSubjects,
              ...searchSubjects,
            ])
          );
          setShowHint(true);
        }}
        placeholder="ค้นหารายวิชาที่ต้องการลง ..."
      />
      {hintSubjects.length != 0 && showHint ? (
        // TODO: add useClickAway for tap outside checking
        <div className="bg-white absolute z-40 overflow-y-auto w-full border-gray-400 shadow border-r border-l border-b">
          {hintSubjects.map((hintSubject) => {
            return (
              <NameComponent
                key={hintSubject.subjectCode}
                subject={hintSubject}
                onChoose={(selectedSubject) => {
                  setSearchSubjects([
                    ...searchSubjects,
                    selectedSubject.subjectCode,
                  ]);
                  setShowHint(false);
                }}
                type={NameComponentType.Hint}
              />
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
