"use client";

import { allGenEdAtom } from "@/atom/allGenEdAtom";
import { useAtom } from "jotai";
import GenEdSubject from "./GenEdSubject";
import clsx from "clsx";
import { stringToNumber } from "@/utils/castUtils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GenEd } from "@/interface/GenEd";
import { getCurrentGenEdSubjects, setFilterParams } from "@/utils/subjectUtils";
import { GenEdType } from "@/constants/enum";
import NextButton from "../Subject/NextButton";
import PreButton from "../Subject/PreButton";
import CheckBoxList from "../CheckboxList";
import { useTranslations } from "next-intl";

export default function GenEdSubjects() {
  const searchParams = useSearchParams()!;
  const page = stringToNumber(searchParams.get("page")) ?? 1;
  const pathname = usePathname();
  const router = useRouter();
  const tGenEdType = useTranslations("GenEdType");
  const tGenEdPage = useTranslations("GenEdPage");

  const [allGenEd] = useAtom(allGenEdAtom);

  const [genEds, setGenEds] = useState<Array<GenEd> | null>(null);
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [totalPage, setTotalPage] = useState<number | null>(null);
  const [setOfGenEdType, setSetOfGenEdType] = useState<Array<GenEdType>>(
    Object.values(GenEdType)
  );

  const getNewPathname = (totalPage: number, nextPage: number) => {
    const newSearchParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    if (nextPage < 1 || nextPage > totalPage) {
      newSearchParams.delete("page");
    } else {
      newSearchParams.set("page", nextPage.toString());
    }

    return `${pathname}?${newSearchParams}`;
  };

  useEffect(() => {
    getCurrentGenEdSubjects({
      setOfGenEdType: setOfGenEdType,
      page: page,
      allGenEd: allGenEd,
    })
      .then((getSubjects) => {
        if (getSubjects != null) {
          setCurrentPage(getSubjects.data.currentPage);
          setTotalPage(getSubjects.data.totalPage);
          setGenEds(getSubjects.data.paginationData);
        } else {
          setGenEds([]);
        }
      })
      .catch((e) => {
        setGenEds(null);
      });
  }, [page, setOfGenEdType]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-x-4 sm:flex-row">
        <div className=" shrink-0">{tGenEdPage("GenEdFilter")}</div>
        <div className="flex flex-wrap gap-x-4">
          {Object.values(GenEdType).map((genEdType) => (
            <CheckBoxList
              text={tGenEdType(genEdType)}
              checkData={genEdType}
              checkList={setOfGenEdType}
              setCheckList={setSetOfGenEdType}
              key={`filter ${genEdType}`}
            />
          ))}
        </div>
      </div>

      {genEds == null ? (
        <div className="w-full flex justify-center items-center mt-4">
          <span className="loading loading-dots loading-md"></span>
        </div>
      ) : (
        <>
          {genEds.map((genEd, index) => {
            return (
              <div
                key={`genEd ${genEd.genEdCode}`}
                className={clsx({
                  "border-b-2 border-neutral-grey-100 py-1":
                    index != genEds.length - 1,
                })}>
                <GenEdSubject
                  genEdCode={genEd.genEdCode}
                  genEd={genEd}
                />
              </div>
            );
          })}
        </>
      )}
      {genEds &&
      genEds?.length > 0 &&
      currentPage != null &&
      totalPage != null ? (
        <div className=" flex flex-row justify-center gap-2 items-center mt-2">
          <PreButton
            currentPage={currentPage}
            onClick={async () => {
              setGenEds(null);
              router.replace(getNewPathname(totalPage!, currentPage! - 1));
            }}
          />
          <p className=" text-base">{`${currentPage} / ${totalPage}`}</p>
          <NextButton
            currentPage={currentPage}
            totalPage={totalPage}
            onClick={async () => {
              setGenEds(null);
              router.replace(getNewPathname(totalPage!, currentPage! + 1));
            }}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
