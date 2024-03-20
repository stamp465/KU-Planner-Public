"use client";

import { ButtonType, ButtonWidth } from "@/constants/enum";
import Button from "../Button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";

export default function ToSubjectsPageButton() {
  const router = useRouter();
  const tSubjectsPage = useTranslations("SubjectsPage");
  const [isLoading, setIsLoading] = useState(false);
  let timeOuts: (string | number | NodeJS.Timeout | undefined)[] = [];

  useEffect(() => {
    if (isLoading) {
      const newTimeOut = setTimeout(() => {
        setIsLoading((prev) => false);
      }, 5000);
      timeOuts.push(newTimeOut);
    } else {
      for (var i = 0; i < timeOuts.length; i++) {
        clearTimeout(timeOuts[i]);
      }
      timeOuts = [];
    }
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <Button
          type={ButtonType.Disable}
          width={ButtonWidth.NotExpand}>
          {
            <span className="loading loading-dots loading-xs xs:loading-sm text-neutral-white"></span>
          }
        </Button>
      ) : (
        <Button
          width={ButtonWidth.NotExpand}
          onClick={async () => {
            setIsLoading((prev) => true);
            router.push("/subjects");
            // setIsLoading((prev) => false);
          }}>
          <div className="flex gap-1 items-center text-xs xs:text-sm font-bold text-neutral-white">
            <div>{tSubjectsPage("Title")}</div>
            <IoIosArrowBack />
          </div>
        </Button>
      )}
    </>
  );
}
