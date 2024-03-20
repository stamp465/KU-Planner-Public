"use client";

import { Subject } from "@/model/subject";
import { useTranslations } from "next-intl";
import NameComponent from "./NameComponent";
import { NameComponentType } from "@/constants/enum";
import { FaCalendarXmark, FaRegSquareMinus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { ItemInterface, ReactSortable } from "react-sortablejs";
import { useAtom } from "jotai";
import { allSubjectsAtom } from "@/atom/allSubjectsAtom";
import { favoriteSubjectsAtom } from "@/atom/favoriteSubjectsAtom";
import { orderSubjectsAtom } from "@/atom/orderSubjectsAtom";
import { searchSubjectsAtom } from "@/atom/searchSubjectsAtom";
import { choiceOfSectionDBAtom } from "@/atom/choiceOfSectionsDBAtom";
import clsx from "clsx";
import { apiSearchSubjectOpenEnr } from "@/service/api-search-subject-open-enr";
import { useSession } from "next-auth/react";
import { HttpStatusCode } from "axios";

interface SubjectItemInterface extends ItemInterface {
  subject: Subject;
}

export default function OrderNameComponent() {
  const { data: session } = useSession();
  const [allSubjects, setAllSubjects] = useAtom(allSubjectsAtom);
  const [favoriteSubjects, setFavoriteSubjects] = useAtom(favoriteSubjectsAtom);
  const [orderSubjects, setOrderSubjects] = useAtom(orderSubjectsAtom);
  const [searchSubjects, setSearchSubjects] = useAtom(searchSubjectsAtom);
  const tSelectedPage = useTranslations("SelectedPage");
  const tCommon = useTranslations("Common");
  const tSubjectsAndSections = useTranslations("SubjectsAndSections");

  const [nowOrderSubjects, setNowOrderSubjects] = useState<
    Array<SubjectItemInterface>
  >([]);
  const [, setChoiceOfSectionDB] = useAtom(choiceOfSectionDBAtom);

  async function checkSubject(
    subject: string,
    allSubjects: Subject[],
    shouldAdd: boolean
  ): Promise<Subject> {
    let subjectFromAll = allSubjects.find((s) => s.subjectCode === subject);
    if (!subjectFromAll) {
      if (!session?.token.accesstoken) {
        if (shouldAdd) {
          allSubjects.push(
            new Subject({
              subjectCode: subject,
              subjectNameTH: "ไม่พบข้อมูล",
              section: [],
              setOfDay: [],
              setOfStdStatus: [],
            })
          );
        }
        return new Subject({
          subjectCode: subject,
          subjectNameTH: "ไม่พบข้อมูล",
          section: [],
          setOfDay: [],
          setOfStdStatus: [],
        });
      }

      const { data, status } = await apiSearchSubjectOpenEnr({
        query: subject,
        accessToken: session?.token.accesstoken,
      });
      if (status == HttpStatusCode.Ok) {
        if (data.subjects.length > 0) {
          // setAllSubjects([...allSubjects, new Subject(data.subjects[0])]);
          if (shouldAdd) {
            allSubjects.push(new Subject(data.subjects[0]));
          }
          return new Subject(data.subjects[0]);
        } else {
          if (shouldAdd) {
            allSubjects.push(
              new Subject({
                subjectCode: subject,
                subjectNameTH: "ไม่พบข้อมูล",
                section: [],
                setOfDay: [],
                setOfStdStatus: [],
              })
            );
          }
          return new Subject({
            subjectCode: subject,
            subjectNameTH: "ไม่พบข้อมูล",
            section: [],
            setOfDay: [],
            setOfStdStatus: [],
          });
        }
      } else {
        console.log("apiSearchSubjectOpenEnr error");
        if (shouldAdd) {
          allSubjects.push(
            new Subject({
              subjectCode: subject,
              subjectNameTH: "ไม่พบข้อมูล",
              section: [],
              setOfDay: [],
              setOfStdStatus: [],
            })
          );
        }
        return new Subject({
          subjectCode: subject,
          subjectNameTH: "ไม่พบข้อมูล",
          section: [],
          setOfDay: [],
          setOfStdStatus: [],
        });
      }
    }
    return subjectFromAll;
  }

  async function setAllSubjectsWithNotFoundData() {
    const oldAllSubjects = [...allSubjects];
    for (const subject of JSON.parse(
      localStorage.getItem("orderSubjects") ?? "[]"
    )) {
      await checkSubject(subject, oldAllSubjects, true);
    }
    for (const subject of JSON.parse(
      localStorage.getItem("favoriteSubjects") ?? "[]"
    )) {
      await checkSubject(subject, oldAllSubjects, true);
    }
    for (const subject of JSON.parse(
      localStorage.getItem("searchSubjects") ?? "[]"
    )) {
      await checkSubject(subject, oldAllSubjects, true);
    }
    setAllSubjects([...oldAllSubjects]);
  }

  function checkSetChoiceOfSectionDB({
    nowOrderSubjects,
    orderSubjects,
  }: {
    nowOrderSubjects: SubjectItemInterface[];
    orderSubjects: string[];
  }) {
    // console.log("nowOrderSubjects", nowOrderSubjects);
    // console.log("orderSubjects", orderSubjects);
    // console.log(
    //   nowOrderSubjects.map((s) => s.subject.subjectCode).join(",") !=
    //     orderSubjects.join(",")
    // );
    if (
      nowOrderSubjects.map((s) => s.subject.subjectCode).join(",") !=
      orderSubjects.join(",")
    ) {
      setChoiceOfSectionDB(undefined);
    }
  }

  const [firstSettingDone, setFirstSettingDone] = useState(false);
  useEffect(() => {
    setAllSubjectsWithNotFoundData()
      .then(() => {})
      .finally(() => {
        setFirstSettingDone(true);
      });
  }, []);

  useEffect(() => {
    if (firstSettingDone) {
      checkSetChoiceOfSectionDB({
        nowOrderSubjects: nowOrderSubjects,
        orderSubjects: orderSubjects,
      });
      setNowOrderSubjects(
        [...orderSubjects].map((subject, index) => {
          return {
            id: index,
            subject: allSubjects.find((s) => s.subjectCode === subject)!,
          };
        })
      );
    }
  }, [favoriteSubjects, orderSubjects, searchSubjects, firstSettingDone]);

  return (
    <div className=" w-full pb-6">
      <div className="flex flex-row justify-between items-center">
        <div className="text-xl font-bold text-primary-green-900">
          {tSelectedPage("NowChoosedSubjectsTitle")}
        </div>
        <div className="text-base text-primary-green-900">
          {`${tCommon("Total")} ${nowOrderSubjects.reduce(
            (sum, subjectItem) =>
              sum +
              (subjectItem.subject && subjectItem.subject.maxCredit
                ? subjectItem.subject.maxCredit
                : 0),
            0
          )} ${tSubjectsAndSections("Credit")}`}
        </div>
      </div>
      <>
        {!firstSettingDone ? (
          <>
            <div className="w-full flex flex-col justify-center items-center mt-4 gap-2">
              <div className="font-bold">{`กำลังดึงข้อมูลรายวิชา กรุณารอซักครู่`}</div>
              <div className="loading loading-dots loading-md"></div>
            </div>
          </>
        ) : (
          <>
            {orderSubjects.length > 0 ? (
              <div className="">
                <ReactSortable
                  filter=".addImageButtonContainer"
                  dragClass="sortableDrag"
                  list={nowOrderSubjects}
                  setList={(newState) => {
                    // console.log("newState", newState);
                    if (newState.length != 0) {
                      checkSetChoiceOfSectionDB({
                        nowOrderSubjects: newState,
                        orderSubjects: orderSubjects,
                      });
                      setNowOrderSubjects(newState);
                      setOrderSubjects(
                        newState.map(
                          (subjectItem) => subjectItem.subject.subjectCode
                        )
                      );
                    }
                  }}
                  animation={200}
                  easing="ease-out">
                  {nowOrderSubjects.map((subjectItem, index) => (
                    <div
                      className={clsx(
                        "flex justify-between items-center border border-primary-green-900 ",
                        "shadow-xl rounded px-3 py-1 my-2 bg-neutral-white"
                      )}
                      key={`nowOrderSubjects-${subjectItem.id}`}>
                      <div className="draggableItem my-1 hover:cursor-pointer">
                        <NameComponent
                          type={NameComponentType.Order}
                          index={index + 1}
                          subject={subjectItem.subject}
                        />
                      </div>
                      <FaRegSquareMinus
                        color={"#002706"}
                        className="hover:cursor-pointer"
                        onClick={() => {
                          setOrderSubjects(
                            orderSubjects.filter(
                              (subject) =>
                                subject != subjectItem.subject.subjectCode
                            )
                          );
                        }}
                      />
                    </div>
                  ))}
                </ReactSortable>
              </div>
            ) : (
              <div className="flex justify-center items-center gap-2">
                <FaCalendarXmark size={32} />
                <div className="text-base">
                  {tSelectedPage("NoNowChoosedSubjectsTitle")}
                </div>
              </div>
            )}
          </>
        )}
      </>
    </div>
  );
}
