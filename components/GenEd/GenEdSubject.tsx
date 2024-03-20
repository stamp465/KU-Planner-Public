import { GenEd } from "@/interface/GenEd";
import { useTranslations } from "next-intl";
import SearchSubjectButton from "./SearchSubjectButton";

export default function GenEdSubject({
  genEdCode,
  genEd,
}: {
  genEdCode: string;
  genEd: GenEd;
}) {
  const tGenEdType = useTranslations("GenEdType");
  const tSubjectsAndSections = useTranslations("SubjectsAndSections");
  return (
    <div className="flex flex-wrap gap-x-4 items-center w-full">
      <div className="font-bold">{`${genEdCode}`}</div>
      <div>{`${genEd?.genEdNameTH}`}</div>
      <div className=" text-primary-green-700">
        <div>{`${tSubjectsAndSections("Credit")} ${genEd?.genEdCredit}`}</div>
      </div>
      <div className="flex flex-wrap gap-1 ml-auto">
        <div className=" bg-accent-info-light px-2 rounded">{`${tGenEdType(
          genEd?.genEdType
        )}`}</div>
        <div className="ml-auto">
          <SearchSubjectButton subjectCode={genEdCode} />
        </div>
      </div>
    </div>
  );
}
