"use client";

import { StdPlanStructure } from "@/model/stdPlanStructure";
import StdPlanStructureComponent from "./StdPlanStructure";
import { SubjectGrade } from "@/interface/SubjectGrade";
import { EnrollSubjectName } from "@/interface/GetEnrollLogRequest";
import StdPlanNotInStructure from "./StdPlanNotInStructure";
import { useSession } from "next-auth/react";
import { apiOpenSubjectForEnroll } from "@/service/api-open-subject-for-enroll";
import { useEffect, useState } from "react";
import { Section } from "@/model/section";
import { SubjectPassType } from "@/constants/enum";
import { FaCircleInfo } from "react-icons/fa6";
import Link from "next/link";
import { IoIosWarning } from "react-icons/io";

interface EnrollSubjectNameWithRelated extends EnrollSubjectName {
  relateSubjectCodes: Array<string>;
}

export default function StdPlanStructureList({
  stdPlansStructures,
  subjectGradesJSON,
}: {
  stdPlansStructures: StdPlanStructure[];
  subjectGradesJSON: string;
}) {
  const subjectGrades: EnrollSubjectName[] = JSON.parse(subjectGradesJSON);
  const subjectGradesInStdPlansStructures: EnrollSubjectName[] =
    stdPlansStructures.reduce((acc, stdPlansStructure) => {
      return [...acc, ...stdPlansStructure.enrollSubjectNames];
    }, [] as EnrollSubjectName[]);

  const { data: session } = useSession();
  const [stdStructures, setStdStructures] = useState(stdPlansStructures);
  const [
    subjectGradesNotInStdPlansStructures,
    setSubjectGradesNotInStdPlansStructures,
  ] = useState(
    subjectGrades
      .filter(
        (subjectGrade) =>
          subjectGrade.isPass !== SubjectPassType.Fail &&
          !subjectGradesInStdPlansStructures
            .map((subjectGradeIN) => subjectGradeIN.subjectCode)
            .includes(subjectGrade.subjectCode)
      )
      .map((subjectGrade) => {
        return {
          ...subjectGrade,
          relateSubjectCodes: [] as string[],
        };
      })
  );
  const [isLoading, setIsLoading] = useState(true);

  // const subjectGradesNotInStdPlansStructures: EnrollSubjectNameWithRelated[] =
  //   subjectGrades
  //     .filter(
  //       (subjectGrade) =>
  //         !subjectGradesInStdPlansStructures
  //           .map((subjectGradeIN) => subjectGradeIN.subjectCode)
  //           .includes(subjectGrade.subjectCode)
  //     )
  //     .map((subjectGrade) => {
  //       return {
  //         ...subjectGrade,
  //         relateSubjectCodes: [],
  //       };
  //     });

  const getWithPromiseAll = async () => {
    setIsLoading(true);
    const promises = subjectGradesNotInStdPlansStructures.map(
      async (enrollSubjectName) => {
        const section: Promise<Section | undefined> = new Promise(
          (resolve, reject) => {
            apiOpenSubjectForEnroll({
              query: enrollSubjectName.subjectCode,
              accessToken: session?.token.accesstoken,
              academicYear: enrollSubjectName.yearSemester!.split("/")[0],
              semester: enrollSubjectName.yearSemester!.split("/")[1],
            }).then(({ data, status }) => {
              const section = data.results.find(
                (section) =>
                  section.sectionCode === enrollSubjectName.sectionCode
              );
              if (section && section.relateSubjectCode) {
                enrollSubjectName.relateSubjectCodes.push(
                  ...section.relateSubjectCode?.split(",")
                );
              }
              resolve(
                data.results.find(
                  (section) =>
                    section.sectionCode === enrollSubjectName.sectionCode
                )
              );
            });
          }
        );
        return section;
      }
    );
    const sections: Array<Section | undefined> = await Promise.all(promises);
    // console.log(sections);

    const newStdStructures = [...stdStructures];
    const doneSubjectCodes: string[] = [];
    subjectGradesNotInStdPlansStructures.forEach(
      (subjectGradesNotInStdPlansStructure) => {
        for (const relateSubjectCode of subjectGradesNotInStdPlansStructure.relateSubjectCodes) {
          for (const stdStructure of newStdStructures) {
            if (stdStructure.subjectsCode.includes(relateSubjectCode)) {
              doneSubjectCodes.push(
                subjectGradesNotInStdPlansStructure.subjectCode
              );
              stdStructure.enrollSubjectNames.push(
                subjectGradesNotInStdPlansStructure
              );
              break;
            }
          }
        }
      }
    );

    setStdStructures([...newStdStructures]);
    setSubjectGradesNotInStdPlansStructures(
      subjectGradesNotInStdPlansStructures.filter(
        (subjectGrade) => !doneSubjectCodes.includes(subjectGrade.subjectCode)
      )
    );
    setIsLoading(false);
  };

  const moveToFree = async () => {
    const newStdStructures = [...stdStructures];
    const doneSubjectCodes: string[] = [];
    newStdStructures.forEach((stdStructure) => {
      if (
        stdStructure.groupLevelOrder === "3" &&
        stdStructure.groupNameTh.includes("หมวดวิชาเลือกเสรี")
      ) {
        stdStructure.enrollSubjectNames = [
          ...stdStructure.enrollSubjectNames,
          ...subjectGradesNotInStdPlansStructures,
        ];
      }
    });

    setStdStructures([...newStdStructures]);
    setSubjectGradesNotInStdPlansStructures([]);
  };

  let test = false;
  useEffect(() => {
    if (!test) {
      getWithPromiseAll();
      test = true;
    }
  }, []);

  return (
    <div className="flex flex-col gap-y-8">
      <div>
        <div
          role="alert"
          className="mt-4 p-4 rounded-lg bg-accent-warning-light  text-sm sm:text-base">
          <div className="flex items-start gap-x-2">
            <IoIosWarning
              size={24}
              color="#FF9800"
            />
            <div>
              <span>{`ข้อมูลที่แสดงอาจไม่ถูกต้องทั้งหมด เนื่องจากไม่ใช่ข้อมูลปัจจุบันของมหาวิทยาลัย เพื่อความมั่นใจกรุณาตรวจสอบกับอาจารย์อีกครั้ง`}</span>
            </div>
          </div>
        </div>
        {!isLoading && subjectGradesNotInStdPlansStructures.length > 0 && (
          <div
            role="alert"
            className="mt-4 p-4 rounded-lg bg-accent-info-light  text-sm sm:text-base">
            <div className="flex items-start gap-x-2">
              <FaCircleInfo
                size={24}
                color="#2196F3"
              />
              <div>
                <span>{`หากมีวิชาที่ไม่พบหมวดหมู่ในฐานข้อมูล กรุณาลองกด`}</span>
                <span className="font-bold">
                  <Link
                    href="#reCheck"
                    className="">
                    <span className="font-bold hover:underline">
                      {`ตรวจสอบอีกครั้ง`}
                    </span>
                  </Link>
                </span>
                <span>{` เพราะการตรวจสอบอาจตกหล่นได้`}</span>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center text-lg font-bold pt-4 underline">
          <div>{`หมวดหมู่`}</div>
          <div className=" shrink-0">{`หน่วยกิต`}</div>
        </div>
        {stdStructures.map((stdPlansStructure) => {
          let doneCredit = 0;
          stdStructures.forEach((stdPlansStructureIN) => {
            if (
              stdPlansStructure.groupLevelOrder.length <=
                stdPlansStructureIN.groupLevelOrder.length &&
              stdPlansStructureIN.groupLevelOrder.startsWith(
                stdPlansStructure.groupLevelOrder
              )
            ) {
              doneCredit += stdPlansStructureIN.enrollSubjectNames.reduce(
                (a, b) => a + (b.isPass ? b.credit : 0),
                0
              );
            }
          });
          return (
            <StdPlanStructureComponent
              stdPlansStructure={stdPlansStructure}
              doneCredit={doneCredit}
              key={`${stdPlansStructure.cstructureId} ${stdPlansStructure.modelId} ${stdPlansStructure.groupLevelOrder}`}
            />
          );
        })}
      </div>

      {isLoading ? (
        <div className=" flex flex-col w-full h-full justify-center items-center bg-neutral-white">
          <span className="loading loading-dots loading-md"></span>
        </div>
      ) : (
        <StdPlanNotInStructure
          enrollSubjectNames={subjectGradesNotInStdPlansStructures}
          onReCheck={getWithPromiseAll}
          onFree={moveToFree}
        />
      )}
    </div>
  );
}
