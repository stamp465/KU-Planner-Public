import { useTranslations } from "next-intl";
import GenEdSubjects from "@/components/GenEd/GenEdSubjects";
import ToSubjectsPageButton from "@/components/GenEd/ToSubjectsPageButton";

export default function GenEd() {
  const tGenEdPage = useTranslations("GenEdPage");

  return (
    <main className="px-4 pb-8 container mx-auto w-full md:max-w-[1296px]">
      <div className="flex justify-between items-center">
        <div className="text-xl xs:text-2xl font-bold text-neutral-black">
          {tGenEdPage("Title")}
        </div>
        <ToSubjectsPageButton />
      </div>

      <div className="my-2 flex gap-4 ">
        <GenEdSubjects />
      </div>
    </main>
  );
}
