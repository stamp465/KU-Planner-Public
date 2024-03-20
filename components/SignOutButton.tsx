"use client";

import { choiceOfSectionDBAtom } from "@/atom/choiceOfSectionsDBAtom";
import { favoriteSubjectsAtom } from "@/atom/favoriteSubjectsAtom";
import { orderSubjectsAtom } from "@/atom/orderSubjectsAtom";
import { searchSubjectsAtom } from "@/atom/searchSubjectsAtom";
import { selectedPageAtom } from "@/atom/selectedPageAtom";
import Button from "@/components/Button";
import { ButtonType, ButtonWidth } from "@/constants/enum";
import { apiSavePlan } from "@/service/api-save-plan";
import { useAtom } from "jotai";
import { getSession, signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ImExit } from "react-icons/im";

export default function SignOutButton({
  width = ButtonWidth.Short,
  showText = false,
}: {
  width?: ButtonWidth;
  showText?: boolean;
}) {
  const { data: session } = useSession();
  const tCommon = useTranslations("Common");
  const [favoriteSubjects, setFavoriteSubjects] = useAtom(favoriteSubjectsAtom);
  const [searchSubjects, setSearchSubjects] = useAtom(searchSubjectsAtom);
  const [orderSubjects, setOrderSubjects] = useAtom(orderSubjectsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [choiceOfSectionDB, setChoiceOfSectionDB] = useAtom(
    choiceOfSectionDBAtom
  );
  const [selectedPage, setSelectedPage] = useAtom(selectedPageAtom);
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
            <span className="loading loading-dots loading-md text-neutral-white"></span>
          }
        </Button>
      ) : (
        <Button
          // text={tCommon("Logout")}
          width={width}
          onClick={async () => {
            setIsLoading((prev) => true);
            const session = await getSession();
            await Promise.all([
              await apiSavePlan({
                loginName: session?.user.loginName,
                accesstoken: session?.token.accesstoken,
                renewtoken: session?.token.renewtoken,
                favoriteSubjects: favoriteSubjects,
                searchSubjects: searchSubjects,
                orderSubjects: orderSubjects,
              }),
              await signOut({ callbackUrl: "/" }),
            ]);

            setFavoriteSubjects([]);
            setSearchSubjects([]);
            setOrderSubjects([]);
            setChoiceOfSectionDB(undefined);
            setSelectedPage(1);
          }}>
          <div className="flex gap-x-1 items-center font-bold text-neutral-white">
            <div>
              {showText ? tCommon("Logout") : session?.user.student.loginName}
            </div>
            <ImExit />
          </div>
        </Button>
      )}
    </>
  );
}
