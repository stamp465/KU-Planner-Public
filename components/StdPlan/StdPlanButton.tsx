"use client";

import { stdPlanSelectedClassLevelAtom } from "@/atom/maxGenerateChoicesAtom copy";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";

export default function StdPlanButton({
  planName,
  classLevels,
}: {
  planName: string;
  classLevels: string[];
}) {
  const tStdPlanPage = useTranslations("StdPlanPage");
  const tCommon = useTranslations("Common");
  const [stdPlanSelectedClassLevel, setStdPlanSelectedClassLevel] = useAtom(
    stdPlanSelectedClassLevelAtom
  );

  return (
    <div className="flex items-center justify-between gap-4 mt-4 mb-4">
      <div className="text-lg font-bold text-primary-green-900">
        {planName && `${tStdPlanPage("Plan")} ${planName}`}
      </div>
      <div className="flex items-center gap-2">
        <div className="text-lg font-bold text-primary-green-900">
          {tCommon("Year")}
        </div>
        {classLevels.map((classLevel) => (
          <button
            key={`classLevelButton${classLevel}`}
            className={clsx(
              "rounded-full text-base font-bold h-6 w-6 flex justify-center items-center",
              {
                "bg-neutral-white text-primary-green-900 border border-primary-green-900":
                  stdPlanSelectedClassLevel !== classLevel,
                "bg-primary-green-900 text-white ":
                  stdPlanSelectedClassLevel === classLevel,
              }
            )}
            onClick={() => setStdPlanSelectedClassLevel(classLevel)}>
            {classLevel}
          </button>
        ))}
      </div>
    </div>
  );
}
