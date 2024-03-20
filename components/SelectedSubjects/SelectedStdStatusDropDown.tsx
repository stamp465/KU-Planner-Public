"use client";

import { selectedStdStatusAtom } from "@/atom/selectedStdStatusAtom";
import { StdStatus } from "@/constants/enum";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function SelectedStdStatusDropDown() {
  const { data: session } = useSession();
  const [selectedStdStatus, setSelectedStdStatus] = useAtom(
    selectedStdStatusAtom
  );
  const tStdStatus = useTranslations("StdStatus");
  const tSelectedPage = useTranslations("SelectedPage");
  return (
    <div className="flex flex-row items-center gap-1 text-base text-primary-green-900">
      <div className="font-base">{tSelectedPage("SelectedStdStatusTitle")}</div>
      {session?.user ? (
        <div className="font-bold">
          {tStdStatus(
            selectedStdStatus ??
              (session?.user?.student?.studentStatusNameEn as StdStatus)
          )}
        </div>
      ) : (
        <div className="font-bold">{tStdStatus("Undefined")}</div>
        // <select
        //   className="border-b-2 border-primary-green-900 "
        //   defaultValue={selectedStdStatus ?? "Undefined"}
        //   onChange={(e) => {
        //     if (e.target.value) {
        //       setSelectedStdStatus(
        //         e.target.value == "Undefined"
        //           ? null
        //           : (e.target.value as StdStatus)
        //       );
        //     }
        //   }}>
        //   {Object.values(StdStatus).map((stdStatus) => {
        //     return (
        //       <option
        //         value={stdStatus}
        //         key={`StdStatus ${tStdStatus(stdStatus)}`}>
        //         {tStdStatus(stdStatus)}
        //       </option>
        //     );
        //   })}
        //   <option
        //     value={"Undefined"}
        //     key={`StdStatus Undefined`}>
        //     {tStdStatus("Undefined")}
        //   </option>
        // </select>
      )}
    </div>
  );
}
