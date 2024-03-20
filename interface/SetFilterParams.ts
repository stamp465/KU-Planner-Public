import { ReadonlyURLSearchParams } from "next/navigation";
import { FilterSubject } from "./FilterSubject";

interface FilterSubjectAndPage extends FilterSubject {
  page: number;
}

export interface SetFilterParams {
  value: FilterSubjectAndPage;
  searchParams: ReadonlyURLSearchParams;
  currentPage?: number | null;
}
