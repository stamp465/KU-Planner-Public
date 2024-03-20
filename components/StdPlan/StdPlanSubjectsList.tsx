"use client";

import { StdPlan } from "@/model/stdPlan";
import StdPlanSubject from "./StdPlanSubject";
import { stdPlanSelectedClassLevelAtom } from "@/atom/maxGenerateChoicesAtom copy";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { EnrollSubjectName } from "@/interface/GetEnrollLogRequest";
import { MdFindInPage } from "react-icons/md";
import { SubjectPassType } from "@/constants/enum";

export default function ListOfStdPlanSubjects({
  stdPlansByClassLevelJSON,
  subjectGradesJSON,
  learnSubjectYear,
}: {
  stdPlansByClassLevelJSON: string;
  subjectGradesJSON: string;
  learnSubjectYear?: number;
}) {
  const stdPlansByClassLevel: Record<string, StdPlan[]> = JSON.parse(
    stdPlansByClassLevelJSON
  );
  const subjectGrades: EnrollSubjectName[] = JSON.parse(subjectGradesJSON);
  // console.log(subjectGrades);

  const tCommon = useTranslations("Common");

  const [stdPlanSelectedClassLevel] = useAtom(stdPlanSelectedClassLevelAtom);

  let stdPlansBySemester: Record<string, StdPlan[]> = {};
  if (stdPlansByClassLevel[stdPlanSelectedClassLevel]) {
    stdPlansBySemester = stdPlansByClassLevel[stdPlanSelectedClassLevel].reduce(
      (acc, stdPlan) => {
        if (!acc[stdPlan.semester]) {
          acc[stdPlan.semester] = [];
        }
        acc[stdPlan.semester].push(stdPlan);
        return acc;
      },
      {} as Record<string, StdPlan[]>
    );
  }

  // console.log(subjectGrades.map((sg) => sg.subjectCode));

  function isSubjectLearned(
    learnSubject: EnrollSubjectName,
    stdPlanSubject: StdPlan
  ) {
    const learnSubjectCode = learnSubject.subjectCode.split("-")[0];
    const stdPlanSubjectCode = stdPlanSubject.subjectCode.split("-")[0];

    if (learnSubjectCode === stdPlanSubjectCode) {
      if (
        learnSubjectYear &&
        stdPlanSubject.startYear <= learnSubjectYear &&
        ((stdPlanSubject.endYear &&
          learnSubjectYear <= stdPlanSubject.endYear) ||
          stdPlanSubject.endYear === null)
      ) {
        return true;
      }
    }
    return false;
  }

  return (
    <div className="flex flex-col gap-2">
      {Object.keys(stdPlansBySemester).length > 0 && learnSubjectYear ? (
        (Object.keys(stdPlansBySemester) as Array<string>).map((semester) => (
          <div
            key={`stdPlanSelectedClassLevel${stdPlanSelectedClassLevel}stdPlansBySemester${semester}`}>
            <div className="font-bold text-lg">{`${tCommon(
              "Year"
            )} ${stdPlanSelectedClassLevel} ${tCommon(
              "Semester"
            )} ${semester}`}</div>
            {stdPlansBySemester[semester].map((stdPlan) => {
              const a = subjectGrades
                .filter((sg) => isSubjectLearned(sg, stdPlan))
                .reduce(
                  (acc, sg) =>
                    sg.isPass === SubjectPassType.Pass
                      ? SubjectPassType.Pass
                      : sg.isPass === SubjectPassType.Now
                      ? SubjectPassType.Now
                      : acc,
                  SubjectPassType.Fail
                );
              return (
                <StdPlanSubject
                  key={`${stdPlan.subjectCode}${stdPlan.classLevel}`}
                  stdPlan={stdPlan}
                  isLearn={
                    subjectGrades.filter((sg) => isSubjectLearned(sg, stdPlan))
                      .length > 0
                  }
                  isNowLearn={a}
                />
              );
            })}
          </div>
        ))
      ) : (
        <div className="flex flex-col w-full justify-center items-center gap-2 py-20">
          <MdFindInPage size={72} />
          <div className="text-3xl font-bold text-primary-green-900">
            ไม่พบข้อมูล
          </div>
        </div>
      )}
    </div>
  );
}
