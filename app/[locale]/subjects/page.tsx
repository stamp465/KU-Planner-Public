import { useTranslations } from "next-intl";
import ListOfSubjects from "@/components/Subject/ListOfSubjects";
import SearchBar from "@/components/Subject/SearchBar";
import FilterRightSide from "@/components/Filter/FilterRightSide";
import ToGenEdPageButton from "@/components/GenEd/ToGenEdPageButton";

export default function Subjects() {
  const tSubjectsPage = useTranslations("SubjectsPage");

  return (
    <main className="px-4 pb-8 container mx-auto w-full md:max-w-[1296px]">
      <div className="flex justify-between items-center ">
        <div className="text-xl xs:text-2xl font-bold text-neutral-black ">
          {tSubjectsPage("Title")}
        </div>
        <ToGenEdPageButton />
      </div>

      <div className="my-2 flex gap-4 ">
        <div className="w-full ">
          <SearchBar />
          <ListOfSubjects />
        </div>
        <div className=" shrink-0 hidden sm:flex">
          <FilterRightSide />
        </div>
      </div>
    </main>
  );
}
