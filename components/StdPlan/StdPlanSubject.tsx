import { StdPlan } from "@/model/stdPlan";
import { FaRegCheckCircle } from "react-icons/fa";
import SearchSubjectButton from "../GenEd/SearchSubjectButton";
import { SubjectPassType } from "@/constants/enum";

export default function StdPlanSubject({
  stdPlan,
  isLearn,
  isNowLearn,
}: {
  stdPlan: StdPlan;
  isLearn?: boolean;
  isNowLearn?: SubjectPassType;
}) {
  return (
    <div className="flex justify-between items-center py-2 px-1">
      <div className="flex items-center gap-2">
        <div className="text-base font-bold">{stdPlan.subjectCode}</div>
        <div className="text-base">{stdPlan.subjectNameTH}</div>
      </div>
      <div className="flex items-center gap-2">
        {isNowLearn && isNowLearn === SubjectPassType.Now && (
          <div>{`กำลังลงเรียน`}</div>
        )}
        {isLearn ? (
          <FaRegCheckCircle />
        ) : (
          <SearchSubjectButton subjectCode={stdPlan.subjectCode} />
        )}
      </div>
    </div>
  );
}
