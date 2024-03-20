"use client";

import { ButtonWidth, SubjectPassType } from "@/constants/enum";
import { EnrollSubjectName } from "@/interface/GetEnrollLogRequest";
import Button from "../Button";
import clsx from "clsx";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";

export default function StdPlanNotInStructure({
  enrollSubjectNames,
  onReCheck,
  onFree,
}: {
  enrollSubjectNames: EnrollSubjectName[];
  onReCheck?: () => Promise<void>;
  onFree?: () => Promise<void>;
}) {
  return (
    <div
      className="flex flex-col gap-2 w-full"
      id="reCheck">
      <div
        className={clsx(
          " p-4 rounded-lg",
          {
            "text-accent-error-dark bg-accent-error-light":
              enrollSubjectNames.length > 0,
          },
          {
            "text-accent-success-dark bg-accent-success-light":
              enrollSubjectNames.length === 0,
          }
        )}>
        <div className="flex justify-between flex-wrap items-center gap-x-2 py-1">
          <div className="flex flex-wrap gap-x-1 items-center">
            <div className="font-bold text-base ">{`วิชาที่ไม่พบหมวดหมู่ในฐานข้อมูล`}</div>
            <div className="text-sm ">{`(วิชาเหล่านี้อาจเป็นวิชาเสรี)`}</div>
          </div>
          <div className="flex items-center gap-2">
            {enrollSubjectNames.length > 0 && (
              <>
                <Button
                  width={ButtonWidth.NotExpand}
                  bgColor="bg-accent-success-dark"
                  onClick={onFree}>
                  <div className=" text-neutral-white font-bold text-sm">{`นำวิชาเหล่านี้ไปเป็นวิชาเสรี`}</div>
                </Button>
                <Button
                  width={ButtonWidth.NotExpand}
                  bgColor="bg-accent-error-dark"
                  onClick={onReCheck}>
                  <div className=" text-neutral-white font-bold text-sm">{`ตรวจสอบอีกครั้ง`}</div>
                </Button>
              </>
            )}
          </div>
        </div>
        {enrollSubjectNames.length > 0 ? (
          <>
            {enrollSubjectNames.map((enrollSubjectName, index) => {
              return (
                <div
                  key={`subjectGradesNotInStdPlansStructures ${index}`}
                  className="flex justify-between items-center gap-2 text-sm hover:font-bold ">
                  <div>
                    {`${enrollSubjectName.subjectCode} ${enrollSubjectName.subjectNameTh}`}
                  </div>
                  <div className=" shrink-0">{`${
                    enrollSubjectName.isPass === SubjectPassType.Now
                      ? `${enrollSubjectName.credit} (กำลังเรียน)`
                      : enrollSubjectName.credit
                  }`}</div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="flex gap-2 text-sm items-center">
            <FaCheckCircle />
            <div>{`ทุกวิชาถูกบรรจุในแผนเรียบร้อยแล้ว`}</div>
          </div>
        )}
      </div>
    </div>
  );
}
