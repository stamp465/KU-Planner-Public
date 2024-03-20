import { StdPlanStructure } from "@/model/stdPlanStructure";
import { SubjectGrade } from "@/interface/SubjectGrade";
import clsx from "clsx";
import { SubjectPassType } from "@/constants/enum";

export default function StdPlanStructureComponent({
  stdPlansStructure,
  doneCredit,
}: {
  stdPlansStructure: StdPlanStructure;
  doneCredit: number;
}) {
  const planFont = clsx("text-primary-green-900", {
    "text-lg font-bold":
      stdPlansStructure.groupLevelOrder.split(".").length == 1,
    "text-base font-bold":
      stdPlansStructure.groupLevelOrder.split(".").length == 2,
    "text-sm": stdPlansStructure.groupLevelOrder.split(".").length > 2,
  });

  const planPadding = clsx({
    "": stdPlansStructure.groupLevelOrder.split(".").length == 1,
    "sm:pl-4": stdPlansStructure.groupLevelOrder.split(".").length == 2,
    "sm:pl-12": stdPlansStructure.groupLevelOrder.split(".").length > 2,
  });

  const subPlanFont = clsx("text-primary-green-700 text-sm hover:font-bold ");

  const subPlanPadding = clsx({
    "sm:pl-4": stdPlansStructure.groupLevelOrder.split(".").length == 1,
    "sm:pl-12": stdPlansStructure.groupLevelOrder.split(".").length == 2,
    "sm:pl-16": stdPlansStructure.groupLevelOrder.split(".").length > 2,
  });

  return (
    <div>
      <div
        className={clsx(
          "flex justify-between items-center",
          planFont,
          planPadding
        )}>
        <div className={clsx("flex items-center gap-2")}>
          <div>{stdPlansStructure.groupLevelOrder}</div>
          <div>{stdPlansStructure.groupNameTh}</div>
        </div>
        <div>{`${doneCredit} / ${stdPlansStructure.creditMin}`}</div>
      </div>
      <div
        className={clsx(
          "flex justify-between items-center gap-2",
          subPlanFont,
          subPlanPadding
        )}></div>
      {stdPlansStructure.enrollSubjectNames.map((enrollSubjectName) => {
        return (
          <div
            key={`SubPlan ${stdPlansStructure.groupLevelOrder} ${enrollSubjectName.subjectCode}`}
            className={clsx(
              "flex justify-between items-center gap-2",
              subPlanFont,
              subPlanPadding
            )}>
            <div>{`${enrollSubjectName.subjectCode} ${enrollSubjectName.subjectNameTh}`}</div>
            <div className=" shrink-0">{`${
              enrollSubjectName.isPass === SubjectPassType.Now
                ? `${enrollSubjectName.credit} (กำลังเรียน)`
                : enrollSubjectName.credit
            }`}</div>
          </div>
        );
      })}
    </div>
  );
}
