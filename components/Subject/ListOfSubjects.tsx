"use client";

import { useEffect, useState } from "react";
import SubjectComponent from "@/components/Subject/SubjectComponent";
import { FilterMode } from "@/constants/enum";
import { useTranslations } from "next-intl";
import { Subject } from "@/model/subject";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  stringToBoolean,
  stringToJSONArray,
  stringToNumber,
} from "@/utils/castUtils";
import { getCurrentSubjects, setFilterParams } from "@/utils/subjectUtils";
import { filterSubjectAtom } from "@/atom/filterSubjectAtom";
import { useAtom } from "jotai";
import { allSubjectsAtom } from "@/atom/allSubjectsAtom";
import PreButton from "./PreButton";
import NextButton from "./NextButton";
import { favoriteSubjectsAtom } from "@/atom/favoriteSubjectsAtom";
import { MdFindInPage } from "react-icons/md";

export default function ListOfSubjects() {
  const [allSubjects] = useAtom(allSubjectsAtom);
  const tSubjectsPage = useTranslations("SubjectsPage");
  const searchParams = useSearchParams()!;
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const page = stringToNumber(searchParams.get("page")) ?? 1;
  const searchInput = searchParams.get("searchInput") ?? "";
  const startHour = searchParams.get("startHour");
  const startMinute = searchParams.get("startMinute");
  const endHour = searchParams.get("endHour");
  const endMinute = searchParams.get("endMinute");
  const setOfDay = stringToJSONArray(searchParams.get("setOfDay")) ?? [];
  const setOfStdStatus =
    stringToJSONArray(searchParams.get("setOfStdStatus")) ?? [];
  const setOfGenEdType =
    stringToJSONArray(searchParams.get("setOfGenEdType")) ?? [];
  // console.log(startHour, startMinute, endHour, endMinute);
  // console.log(setOfDay);
  const favorite = stringToBoolean(searchParams.get("favorite"));

  const getNewPathname = (currentPage: number, nextPage: number) => {
    return `${pathname}?${setFilterParams({
      value: {
        page: nextPage,
        ...filterSubject,
        searchInput: searchInput,
      },
      searchParams: searchParams,
      currentPage: currentPage,
    })}`;
  };

  const [filterSubject, setFilterSubject] = useAtom(filterSubjectAtom);
  const [favoriteSubjects, setFavoriteSubjects] = useAtom(favoriteSubjectsAtom);

  // for check param
  const haveNullTimeRange =
    startHour == null ||
    startMinute == null ||
    endHour == null ||
    endMinute == null;
  const allNullTimeRange =
    startHour == null &&
    startMinute == null &&
    endHour == null &&
    endMinute == null;
  const notTrueTimeRange = haveNullTimeRange && !allNullTimeRange;
  const notAllowPage = page < 1;

  // for show subjects
  const [searchSubjects, setSearchSubjects] = useState<Array<Subject> | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [totalPage, setTotalPage] = useState<number | null>(null);

  useEffect(() => {
    // console.log(
    //   pathname,
    //   new URLSearchParams(Array.from(searchParams.entries())).toString()
    // );
    setSearchSubjects(null);

    if (notTrueTimeRange || notAllowPage) {
      router.replace(
        `${pathname}?${setFilterParams({
          value: {
            page: notAllowPage ? 1 : page,
            ...filterSubject,
            timeRange: notTrueTimeRange ? null : filterSubject.timeRange,
          },
          searchParams: searchParams,
          currentPage: currentPage,
        })}`
      );
    } else {
      setFilterSubject({
        searchInput: searchInput,
        timeRange: !allNullTimeRange
          ? {
              startHour: stringToNumber(startHour) ?? 8,
              startMinute: stringToNumber(startMinute) ?? 0,
              endHour: stringToNumber(endHour) ?? 22,
              endMinute: stringToNumber(endMinute) ?? 0,
            }
          : null,
        setOfDay: setOfDay,
        setOfStdStatus: setOfStdStatus,
        filterMode: FilterMode.Or,
        setOfGenEdType: setOfGenEdType,
        favorite: favorite,
      });
      // console.log("filterSubject", filterSubject);
    }
  }, [searchParams]);

  useEffect(() => {
    // console.log(
    //   pathname,
    //   new URLSearchParams(Array.from(searchParams.entries())).toString()
    // );
    if (status !== "loading") {
      getCurrentSubjects({
        page: page,
        session: session,
        filterSubject: filterSubject,
        subjects: allSubjects,
        favoriteSubjects: favoriteSubjects,
      })
        .then((getSubjects) => {
          if (getSubjects != null) {
            // console.log("getSubjects", getSubjects);
            setCurrentPage(getSubjects.data.currentPage);
            setTotalPage(getSubjects.data.totalPage);
            setSearchSubjects(getSubjects.data.paginationData);
          } else {
            setSearchSubjects([]);
          }
        })
        .catch((e) => {
          setSearchSubjects(null);
        });
    }
  }, [status, filterSubject]);

  if (status === "loading") {
    return (
      <div className=" flex flex-col w-full h-screen justify-center items-center bg-neutral-white">
        <span className="loading loading-dots loading-md"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center pt-4">
      {searchSubjects == null ? (
        <div className="w-full flex flex-col justify-center items-center mt-4 gap-2">
          <div className="font-bold">{`กำลังดึงข้อมูลรายวิชา กรุณารอซักครู่`}</div>
          <div className="loading loading-dots loading-md"></div>
        </div>
      ) : searchSubjects.length == 0 ? (
        <>
          <div className="flex flex-col w-full justify-center items-center gap-2 py-20">
            <MdFindInPage size={72} />
            <div className="text-xl font-bold text-primary-green-900">
              {tSubjectsPage("NoSubjects")}
            </div>
          </div>
        </>
      ) : (
        <>
          {searchSubjects?.map((subject) => (
            <div
              className=" mb-4"
              key={subject.subjectCode}>
              <SubjectComponent subject={subject} />
            </div>
          ))}
          {currentPage != null && totalPage != null ? (
            <div className=" flex flex-row justify-center gap-2 items-center">
              <PreButton
                currentPage={currentPage}
                onClick={async () => {
                  setSearchSubjects(null);
                  router.replace(
                    getNewPathname(currentPage!, currentPage! - 1)
                  );
                }}
              />
              <p className=" text-base">{`${currentPage} / ${totalPage}`}</p>
              <NextButton
                currentPage={currentPage}
                totalPage={totalPage}
                onClick={async () => {
                  setSearchSubjects(null);
                  router.replace(
                    getNewPathname(currentPage!, currentPage! + 1)
                  );
                }}
              />
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
}
