import { useLocale, useTranslations } from "next-intl";
import Chip from "@/components/Chip";
import { ChipType, listOfSortedDays } from "@/constants/enum";
import { Subject } from "@/model/subject";
import SectionModal from "@/components/Section/SectionModal";
import clsx from "clsx";
import { favoriteSubjectsAtom } from "@/atom/favoriteSubjectsAtom";
import { useAtom } from "jotai";
import LikeButton from "./LikeButton";

export default function SubjectComponent({ subject }: { subject: Subject }) {
  const locale = useLocale();
  const tSubjectsAndSections = useTranslations("SubjectsAndSections");
  const [favoriteSubjects, setFavoriteSubjects] = useAtom(favoriteSubjectsAtom);
  const isFavorite = favoriteSubjects.includes(subject.subjectCode);
  const tGenEdType = useTranslations("GenEdType");

  return (
    <div
      className={clsx("p-3 border rounded", {
        "border-primary-green-500": isFavorite,
        "border-neutral-grey-400": !isFavorite,
      })}>
      <div className="flex flex-col justify-start gap-2">
        <div className="flex justify-between">
          <div className="flex flex-wrap gap-x-1 items-center">
            <div className=" text-base font-bold text-primary-green-900">
              {`${subject.subjectCode} ${
                locale === "en" ? subject.subjectNameEN : subject.subjectNameTH
              }`}
            </div>
            {subject.genEdType && (
              <div className=" text-primary-green-900 text-sm bg-accent-info-light rounded px-1">
                {tGenEdType(subject.genEdType)}
              </div>
            )}
          </div>
          <div className="hidden xs:flex">
            <LikeButton subjectCode={subject.subjectCode} />
          </div>
        </div>
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
          <div className=" flex justify-start gap-x-2 items-center flex-wrap">
            <div className=" text-base text-primary-green-900">
              {tSubjectsAndSections("SetOfDayTitleText")}
            </div>
            {subject.setOfDay.length > 0 ? (
              listOfSortedDays(subject.setOfDay).map((day) => (
                <Chip
                  type={ChipType.Day}
                  day={day}
                  key={day}
                />
              ))
            ) : (
              <Chip
                text="ดูหมู่เรียนเพื่อตรวจสอบ"
                type={ChipType.Normal}></Chip>
            )}
          </div>
          <div className="flex flex-row justify-between w-full xs:w-fit">
            <SectionModal
              subject={subject}
              key={`SectionModal${subject.subjectNameTH}${subject.subjectCode}`}
            />
            <div className="flex xs:hidden">
              <LikeButton subjectCode={subject.subjectCode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
