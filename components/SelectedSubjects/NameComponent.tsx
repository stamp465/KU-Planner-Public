import { ChipType, NameComponentType } from "@/constants/enum";
import { Subject } from "@/model/subject";
import { useLocale, useTranslations } from "next-intl";
import Chip from "../Chip";
import {
  FaRegSquarePlus,
  FaRegSquareMinus,
  FaRegTrashCan,
} from "react-icons/fa6";

export default function NameComponent({
  subject,
  type,
  backgroundColor,
  index,
  isChoose,
  onChoose,
  onUnChoose,
  onDelete,
}: {
  subject: Subject;
  type: NameComponentType;
  backgroundColor?: string;
  index?: number;
  isChoose?: boolean;
  onChoose?: (subject: Subject) => void;
  onUnChoose?: (subject: Subject) => void;
  onDelete?: (subject: Subject) => void;
}) {
  const bgColor =
    isChoose && backgroundColor ? backgroundColor : "bg-neutral-white";
  const shape = type != NameComponentType.Hint ? "rounded" : "";
  const padding = type == NameComponentType.Order ? "" : "px-3 py-2 ";
  const locale = useLocale();
  const tSubjectsAndSections = useTranslations("SubjectsAndSections");
  const hover = type == NameComponentType.Hint ? "hover:cursor-pointer" : "";
  const border =
    type != NameComponentType.Order ? "border-b border-neutral-gray-400" : "";

  const ButtonAction = () => {
    return (
      <div className="flex flex-row gap-2">
        {onDelete && (
          <button
            onClick={() => {
              if (onDelete != undefined) {
                onDelete(subject);
              }
            }}>
            <FaRegTrashCan color={"#002706"} />
          </button>
        )}

        <button
          onClick={(_) => {
            if (isChoose) {
              if (onUnChoose != undefined) {
                onUnChoose(subject);
              }
            } else {
              if (onChoose != undefined) {
                onChoose(subject);
              }
            }
          }}>
          {isChoose != null ? (
            isChoose ? (
              <FaRegSquareMinus color={"#002706"} />
            ) : (
              <FaRegSquarePlus color={"#002706"} />
            )
          ) : (
            <></>
          )}
        </button>
      </div>
    );
  };

  return (
    <div
      className={`${bgColor} ${shape} ${padding} ${hover} ${border} w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-x-2`}
      onClick={(_) => {
        if (type == NameComponentType.Hint && onChoose != undefined) {
          onChoose(subject);
        }
      }}>
      <div className="flex gap-2 justify-between w-full md:w-fit">
        <div className="flex gap-2">
          {index != undefined ? (
            <div className=" rounded-full w-6 bg-neutral-grey-200 text-base font-bold text-center">
              {index}
            </div>
          ) : (
            <></>
          )}
          <div className=" text-base text-primary-green-900 whitespace-nowrap">
            {subject.subjectCode}
          </div>
        </div>
        <div className="flex md:hidden">
          <ButtonAction />
        </div>
      </div>
      <div className=" w-full flex flex-wrap gap-x-2 ">
        <div className="text-left text-base text-primary-green-900 ">
          {locale === "en" ? subject.subjectNameEN : subject.subjectNameTH}
        </div>
        {subject.sectionTypes?.map((section) => (
          <Chip
            key={`${subject.subjectCode} ${section}`}
            type={ChipType.Section}
            section={section}></Chip>
        ))}
        <Chip
          type={ChipType.Normal}
          text={`${subject.maxCredit} ${tSubjectsAndSections(
            "Credit"
          )}`}></Chip>
      </div>
      <div className="hidden md:flex">
        <ButtonAction />
      </div>
    </div>
  );
}
