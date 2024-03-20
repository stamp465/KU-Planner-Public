import StdPlanButton from "@/components/StdPlan/StdPlanButton";
import StdPlanStructureList from "@/components/StdPlan/StdPlanStructureList";
import StdPlanSubject from "@/components/StdPlan/StdPlanSubject";
import ListOfStdPlanSubjects from "@/components/StdPlan/StdPlanSubjectsList";
import {
  EnrollSubjectName,
  GetEnrollResultRequest,
} from "@/interface/GetEnrollLogRequest";
import { StdEducation } from "@/interface/StdEducation";
import { StudentYearGrade } from "@/interface/StudentYearGrade";
import { SubjectGrade } from "@/interface/SubjectGrade";
import { StdPlan } from "@/model/stdPlan";
import { StdPlanStructure } from "@/model/stdPlanStructure";
import { apiCheckGrade } from "@/service/api-check-grade";
import { apiGetListOfEnrollResult } from "@/service/api-get-list-of-enroll-log";
import { apiGetSchedule } from "@/service/api-get-schedule";
import { apiGetStdEducation } from "@/service/api-get-std-education";
import { apiGetStdPlan } from "@/service/api-get-std-plan";
import { apiGetStdPlanStructure } from "@/service/api-get-std-plan-structure";
import { authOptions } from "@/utils/auth";
import { Session, getServerSession } from "next-auth";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";

function findCmasterId(userStdEducation: StdEducation) {
  try {
    if (userStdEducation.education[0].curNameTh) {
      const stdEducation = userStdEducation.education[0].curNameTh.split(" ");
      if (stdEducation.length > 1) {
        return {
          cmasterId: stdEducation[0],
          learnSubjectYear: parseInt(stdEducation[stdEducation.length - 1]),
        };
      }
    }
  } catch (error) {
    // console.log(error);
  }
  return {
    cmasterId: undefined,
    learnSubjectYear: undefined,
    subjectGrades: [],
  };
}

export default async function StdPlanPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    notFound();
  }

  const [
    { data: userGradeResponse, status: userGradeStatus },
    { data: userStdEducationResponse, status: userStdEducationStatus },
    { data: getScheduleResponse, status: getScheduleStatus },
  ] = await Promise.all([
    apiCheckGrade(session?.token.accesstoken, session?.user.idcode),
    apiGetStdEducation(session?.token.accesstoken, session?.user.student.stdId),
    await apiGetSchedule({
      accessToken: session?.token.accesstoken,
      campusCode: session?.user.student.campusCode,
      facultyCode: session?.user.student.facultyCode,
      majorCode: session?.user.student.majorCode,
      userType: session?.user.userType,
      stdStatusCode: session?.user.student.studentStatusCode,
    }),
  ]);

  // console.log(userGradeResponse.data[0].grade);
  // console.log(userStdEducationResponse.data);

  const { cmasterId, learnSubjectYear } = findCmasterId(
    userStdEducationResponse.data
  );
  if (!cmasterId) {
    notFound();
  }

  // console.log(cmasterId, learnSubjectYear, subjectGrades);

  const enrollResultRequest = userGradeResponse.data.map(
    (userGrade) =>
      ({
        semester: userGrade.academicYear.split("/")[1],
        academicYear: userGrade.academicYear.split("/")[0],
        stdId: session?.user.student.stdId,
        subjectCodes: userGrade.grade
          .filter(
            (subjectGrade) =>
              subjectGrade.grade.toLocaleUpperCase() != "F" &&
              subjectGrade.grade.toLocaleUpperCase() != "P" &&
              subjectGrade.grade.toLocaleUpperCase() != "N"
          )
          .map((subjectGrade) => subjectGrade.subject_code),
        subjectCodesFail: userGrade.grade
          .filter(
            (subjectGrade) =>
              subjectGrade.grade.toLocaleUpperCase() != "F" ||
              subjectGrade.grade.toLocaleUpperCase() != "P" ||
              subjectGrade.grade.toLocaleUpperCase() != "N"
          )
          .map((subjectGrade) => subjectGrade.subject_code),
      } as GetEnrollResultRequest)
  );

  const [
    { data: stdPlansResponse, status: stdPlanStatus },
    { data: stdPlansStructureResponse, status: stdPlanStructureStatus },
    { data: mapYearAndPassSubjResponse, status: mapYearAndPassSubjStatus },
  ] = await Promise.all([
    await apiGetStdPlan({
      campusCode: session?.user.student.campusCode,
      accessToken: session?.token.accesstoken,
      cmasterId: cmasterId,
    }),
    await apiGetStdPlanStructure({
      accessToken: session?.token.accesstoken,
      cmasterId: cmasterId,
    }),
    await apiGetListOfEnrollResult(
      getScheduleResponse.data[0]
        ? [
            {
              semester: getScheduleResponse.data[0].semester.toString(),
              academicYear: getScheduleResponse.data[0].academicYr.toString(),
              stdId: session?.user.student.stdId,
              subjectCodes: [],
              subjectCodesFail: [],
            },
            ...enrollResultRequest,
          ]
        : enrollResultRequest,
      session?.token.accesstoken
    ),
  ]);
  // console.log(stdPlansResponse.data[0], stdPlanStatus);
  // console.log(stdPlansStructureResponse.data[0], stdPlanStructureStatus);
  // console.log(mapYearAndPassSubjResponse.data, mapYearAndPassSubjStatus);

  // group stdPlansResponse.data by classLevel
  const stdPlansByClassLevel = stdPlansResponse.data.reduce((acc, stdPlan) => {
    if (!acc[stdPlan.classLevel]) {
      acc[stdPlan.classLevel] = [];
    }
    acc[stdPlan.classLevel].push(stdPlan);
    return acc;
  }, {} as Record<string, StdPlan[]>);
  // console.log(stdPlansByClassLevel);

  // get all value of record mapYearAndPassSubjResponse.data that map by key by reduce
  let subjectGrades: EnrollSubjectName[] = [];
  for (const i in mapYearAndPassSubjResponse.data) {
    subjectGrades = [
      ...subjectGrades,
      ...mapYearAndPassSubjResponse.data[i].map((enroll) => {
        return {
          ...enroll,
          yearSemester: i,
        };
      }),
    ];
  }
  // console.log(subjectGrades);

  stdPlansStructureResponse.data.forEach((planStructure) => {
    planStructure.enrollSubjectNames =
      subjectGrades.filter((subjectGrade) =>
        planStructure.subjectsCode.includes(subjectGrade.subjectCode)
      ) ?? [];
  });
  // console.log(stdPlansStructureResponse.data);

  return (
    <GetTranslations
      session={session}
      learnSubjectYear={learnSubjectYear}
      subjectGradesJSON={JSON.stringify(subjectGrades)}
      stdPlansByClassLevelJSON={JSON.stringify(stdPlansByClassLevel)}
      stdPlansStructureJSON={JSON.stringify(stdPlansStructureResponse.data)}
    />
  );
}

function GetTranslations({
  session,
  learnSubjectYear,
  subjectGradesJSON,
  stdPlansByClassLevelJSON,
  stdPlansStructureJSON,
}: {
  session: Session | null;
  learnSubjectYear: number;
  subjectGradesJSON: string;
  stdPlansByClassLevelJSON: string;
  stdPlansStructureJSON: string;
}) {
  const tStdPlanPage = useTranslations("StdPlanPage");
  // console.log(JSON.parse(stdPlansByClassLevelJSON));
  const stdPlansByClassLevel: Record<string, StdPlan[]> = JSON.parse(
    stdPlansByClassLevelJSON
  );
  const stdPlansStructures: StdPlanStructure[] = JSON.parse(
    stdPlansStructureJSON
  );
  const stdPlansStructureModels = Array.from(
    new Set(
      stdPlansStructures.map((stdPlansStructure) => stdPlansStructure.modelId)
    )
  );
  // console.log("--------------stdPlansStructure------------");
  // console.log(stdPlansStructures);
  // console.log(stdPlansStructureModels);
  // console.log(planStructureMapJSON);

  return (
    <main className="px-4 pb-8 container mx-auto w-full md:max-w-[1296px]">
      <div className="flex flex-col gap-2">
        <div
          role="tablist"
          className="tabs tabs-bordered">
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab text-base sm:text-xl font-bold text-neutral-black"
            aria-label={tStdPlanPage("Title")}
            defaultChecked={true}
          />
          <div
            role="tabpanel"
            className="tab-content">
            {stdPlansStructureModels.length === 1 ? (
              <StdPlanStructureList
                stdPlansStructures={stdPlansStructures}
                subjectGradesJSON={subjectGradesJSON}
              />
            ) : (
              <div className="pt-4 flex flex-col gap-y-2">
                {stdPlansStructureModels.map((modelId) => (
                  <div
                    key={`modelId ${modelId}`}
                    className="border-b border-primary-green-900">
                    <div
                      tabIndex={0}
                      className="collapse collapse-arrow px-2">
                      <input type="checkbox" />
                      <div className="collapse-title text-lg text-primary-green-900 font-bold">
                        <div className="py-1">
                          {`${tStdPlanPage("Model")} ${modelId}`}
                        </div>
                      </div>

                      <div className="collapse-content ">
                        <div className="px-4 bg-primary-green-25 rounded-xl mb-4">
                          <StdPlanStructureList
                            stdPlansStructures={stdPlansStructures.filter(
                              (stdPlansStructure) =>
                                stdPlansStructure.modelId === modelId
                            )}
                            subjectGradesJSON={subjectGradesJSON}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab text-base sm:text-lg font-bold text-neutral-black"
            aria-label={tStdPlanPage("Example")}
          />
          <div
            role="tabpanel"
            className="tab-content">
            <div className="flex flex-col">
              {Object.keys(stdPlansByClassLevel).length > 0 ? (
                <StdPlanButton
                  planName={
                    stdPlansByClassLevel[
                      (Object.keys(stdPlansByClassLevel) as Array<string>)[0]
                    ][0].planName
                  }
                  classLevels={
                    Object.keys(stdPlansByClassLevel) as Array<string>
                  }
                />
              ) : (
                <></>
              )}
              <ListOfStdPlanSubjects
                stdPlansByClassLevelJSON={stdPlansByClassLevelJSON}
                subjectGradesJSON={subjectGradesJSON}
                learnSubjectYear={learnSubjectYear}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
