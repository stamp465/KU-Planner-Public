import { useTranslations } from "next-intl";
import SearchSubjectWithHint from "@/components/SelectedSubjects/SearchSubjectWithHint";
import SearchNameComponent from "@/components/SelectedSubjects/SearchNameComponent";
import FavoriteNameComponent from "@/components/SelectedSubjects/FavoriteNameComponent";
import SelectedSubjectsButton from "@/components/SelectedSubjects/SelectedSubjectsButton";
import OrderNameComponent from "@/components/SelectedSubjects/OrderNameComponent";
import ShouldSelectedNameComponent from "@/components/SelectedSubjects/ShouldSelectedNameComponent";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { apiGetStdPlan } from "@/service/api-get-std-plan";
import { apiGetStdEducation } from "@/service/api-get-std-education";
import { StdEducation } from "@/interface/StdEducation";
import { StdPlan } from "@/model/stdPlan";
import { apiGetSchedule } from "@/service/api-get-schedule";

function findCmasterId(userStdEducation: StdEducation) {
  try {
    if (userStdEducation.education[0].curNameTh) {
      const stdEducation = userStdEducation.education[0].curNameTh.split(" ");
      if (stdEducation.length > 1) {
        return {
          cmasterId: stdEducation[0],
        };
      }
    }
  } catch (error) {
    // console.log(error);
  }
  return {
    cmasterId: undefined,
  };
}

export default async function SelectedSubjects() {
  const session = await getServerSession(authOptions);

  const getStdPlans = async () => {
    if (session?.user) {
      const [
        { data: userStdEducationResponse, status: userStdEducationStatus },
        { data: getScheduleResponse, status: getScheduleStatus },
      ] = await Promise.all([
        await apiGetStdEducation(
          session?.token.accesstoken,
          session?.user.student.stdId
        ),
        await apiGetSchedule({
          accessToken: session?.token.accesstoken,
          campusCode: session?.user.student.campusCode,
          facultyCode: session?.user.student.facultyCode,
          majorCode: session?.user.student.majorCode,
          userType: session?.user.userType,
          stdStatusCode: session?.user.student.studentStatusCode,
        }),
      ]);

      const { cmasterId } = findCmasterId(userStdEducationResponse.data);

      if (cmasterId) {
        const { data: stdPlansResponse, status: stdPlanStatus } =
          await apiGetStdPlan({
            campusCode: session?.user.student.campusCode,
            accessToken: session?.token.accesstoken,
            cmasterId: cmasterId,
          });
        return stdPlansResponse.data.filter(
          (stdPlan) =>
            stdPlan.classLevel == session?.user.student.studentYear &&
            stdPlan.semester == getScheduleResponse.data[0].semester
        );
      }
    }
  };

  const stdPlans = await getStdPlans();
  // console.log("--------stdPlans--------", stdPlans ? stdPlans : undefined);

  return (
    <GetTranslations
      session={session}
      stdPlans={stdPlans ?? []}
    />
  );
}

function GetTranslations({
  session,
  stdPlans,
}: {
  session: Session | null;
  stdPlans: StdPlan[];
}) {
  const tSelectedPage = useTranslations("SelectedPage");
  // console.log("--------StdPlan--------", stdPlans[0]);

  return (
    <main className="container mx-auto w-full md:max-w-[1296px] flex flex-col gap-2 px-4 pb-8">
      <SelectedSubjectsButton />

      <OrderNameComponent />

      {session?.user && <ShouldSelectedNameComponent stdPlans={stdPlans} />}
      <FavoriteNameComponent />

      <div className="text-base text-left w-full mt-4">
        <div className="font-bold">{tSelectedPage("SearchSubjectsTitle")}</div>
        <div className="text-sm text-accent-error">
          <span>{`เนื่องจากข้อมูลในระบบมีไม่ตรงกับความเป็นจริง ในการค้นหาข้อมูลอาจไม่พบวิชาที่ท่านต้องการ `}</span>
          <span className="font-bold">{`โดยท่านสามารถค้นหามันจากหน้าค้นหารายวิชา และกดชื่นชอบเอาไว้แทนได้`}</span>
        </div>
      </div>
      <SearchSubjectWithHint />
      <SearchNameComponent />
    </main>
  );
}
