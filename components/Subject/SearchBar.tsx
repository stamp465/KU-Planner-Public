"use client";

import FilterButton from "@/components/Filter/FilterButton";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { stringToNumber } from "@/utils/castUtils";
import TextField from "@/components/TextField";
import { setFilterParams } from "@/utils/subjectUtils";
import { filterSubjectAtom } from "@/atom/filterSubjectAtom";
import { useAtom } from "jotai";

export default function SearchBar() {
  const tSubjectsPage = useTranslations("SubjectsPage");
  const searchParams = useSearchParams()!;
  const router = useRouter();
  const pathname = usePathname();

  const page = stringToNumber(searchParams.get("page")) ?? 1;
  const searchInput = searchParams.get("searchInput") ?? "";

  const [filterSubject, setFilterSubject] = useAtom(filterSubjectAtom);

  return (
    <>
      <div>
        <div className="flex justify-between gap-4 ">
          <TextField
            placeholder={tSubjectsPage("InputPlaceholder")}
            defaultValue={searchInput}
            onChange={(searchInput) => {
              router.replace(
                `${pathname}?${setFilterParams({
                  value: {
                    page: page,
                    ...filterSubject,
                    searchInput: searchInput,
                  },
                  searchParams: searchParams,
                })}`
              );
            }}></TextField>
          <div className="flex sm:hidden">
            <FilterButton />
          </div>
        </div>
      </div>
    </>
  );
}
