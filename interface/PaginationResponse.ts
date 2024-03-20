export interface PaginationResponse<T> {
  paginationData: Array<T>;
  currentPage: number;
  totalPage: number;
  pageSize: number;
}
