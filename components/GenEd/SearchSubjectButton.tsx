"use client";

import { ButtonWidth } from "@/constants/enum";
import Button from "../Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

export default function SearchSubjectButton({
  subjectCode,
}: {
  subjectCode: string;
}) {
  const tGenEdPage = useTranslations("GenEdPage");
  const router = useRouter();

  return (
    <Button
      width={ButtonWidth.NotExpand}
      onClick={async () => {
        router.push(`/subjects?searchInput=${subjectCode}`);
      }}>
      <div className="text-sm font-bold text-neutral-white">
        {/* {tGenEdPage("SubjectDetail")} */}
        <FiSearch />
      </div>
    </Button>
  );
}
