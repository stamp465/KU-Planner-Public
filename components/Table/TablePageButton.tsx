"use client";
import { useTranslations } from "next-intl";
import Button from "../Button";
import { ButtonType, ButtonWidth } from "@/constants/enum";
import { useRouter } from "next/navigation";
import ChangePlanModal from "./ChangePlanModal";
import { MutableRefObject } from "react";
import { toPng } from "html-to-image";
import { selectedPageAtom } from "@/atom/selectedPageAtom";
import { useAtom } from "jotai";
import { choiceOfSectionsAtom } from "@/atom/choiceOfSectionsAtom";
import { selectedChoiceOfSectionAtom } from "@/atom/selectedChoiceOfSectionAtom";
import { apiSavePlan } from "@/service/api-save-plan";
import { favoriteSubjectsAtom } from "@/atom/favoriteSubjectsAtom";
import { orderSubjectsAtom } from "@/atom/orderSubjectsAtom";
import { searchSubjectsAtom } from "@/atom/searchSubjectsAtom";
import { useSession } from "next-auth/react";
import { choiceOfSectionDBAtom } from "@/atom/choiceOfSectionsDBAtom";
import { SlPicture } from "react-icons/sl";
import { BsDatabaseFillAdd } from "react-icons/bs";
import { RiArrowGoBackFill } from "react-icons/ri";

export default function TablePageButton({
  imageRef,
}: {
  imageRef: MutableRefObject<HTMLDivElement | undefined>;
}) {
  const [selectedPage, setSelectedPage] = useAtom(selectedPageAtom);
  const [selectedChoiceOfSection, setSelectedChoiceOfSection] = useAtom(
    selectedChoiceOfSectionAtom
  );
  const [choiceOfSections] = useAtom(choiceOfSectionsAtom);
  const [favoriteSubjects, setFavoriteSubjects] = useAtom(favoriteSubjectsAtom);
  const [searchSubjects, setSearchSubjects] = useAtom(searchSubjectsAtom);
  const [orderSubjects, setOrderSubjects] = useAtom(orderSubjectsAtom);
  const [, setChoiceOfSectionDB] = useAtom(choiceOfSectionDBAtom);

  const tCommon = useTranslations("Common");
  const tTablePage = useTranslations("TablePage");
  const router = useRouter();

  const { data: session } = useSession();

  const SaveTablePicture = () => {
    return (
      <Button
        type={ButtonType.Normal}
        width={ButtonWidth.NotExpand}
        bgColor="bg-primary-green-700 hover:bg-primary-green-500"
        onClick={async () => {
          if (imageRef.current) {
            const saveOldWidth = imageRef.current.style.minWidth;
            // console.log(imageRef.current.style.minWidth);
            imageRef.current.style.minWidth = "1280px";
            const dataUrl = await toPng(imageRef.current, {
              skipAutoScale: false,
              pixelRatio: 5,
              backgroundColor: "white",
            }).catch((err) => {
              return null;
            });
            if (dataUrl) {
              const link = document.createElement("a");
              link.download = "ku-planner-table";
              link.href = dataUrl;
              link.click();
            }
            imageRef.current!.style.minWidth = saveOldWidth;
          }
        }}>
        <div className="flex gap-1 text-neutral-white font-bold items-center">
          <div className="text-xs sm:text-base">{tTablePage("PicTable")}</div>
          <SlPicture />
        </div>
      </Button>
    );
  };

  const SaveTable = () => {
    return (
      <Button
        type={ButtonType.Normal}
        width={ButtonWidth.NotExpand}
        onClick={async () => {
          const nowChoiceOfSections =
            choiceOfSections[selectedChoiceOfSection ?? 0];
          if (session?.user) {
            await apiSavePlan({
              loginName: session?.user.loginName,
              accesstoken: session?.token.accesstoken,
              renewtoken: session?.token.renewtoken,
              favoriteSubjects: favoriteSubjects,
              searchSubjects: searchSubjects,
              orderSubjects: orderSubjects,
              choiceOfSection: nowChoiceOfSections,
            });
            setChoiceOfSectionDB(nowChoiceOfSections);
          }
        }}>
        <div className="flex gap-1 text-neutral-white font-bold items-center">
          <div className="text-xs sm:text-base">{tTablePage("SaveTable")}</div>
          <BsDatabaseFillAdd />
        </div>
      </Button>
    );
  };

  return (
    <div className="w-full flex justify-between items-center flex-row flex-wrap">
      <div className="text-2xl font-bold text-primary-green-900 shrink-0">
        {tTablePage("Title")}
      </div>
      <div className="flex w-fit overflow-auto gap-2 ml-0">
        <Button
          type={ButtonType.Outline}
          width={ButtonWidth.NotExpand}
          text={tCommon("Previous")}
          onClick={async () => {
            setSelectedPage(1);
            router.push("/selectedSubjects");
          }}>
          <RiArrowGoBackFill />
        </Button>
        <ChangePlanModal />
        <SaveTablePicture />
        {session?.user && <SaveTable />}
      </div>
    </div>
  );
}
