export interface MyKUResponse<T> {
  code: string;
  results: Array<T>;
}

export interface MyKUResponse2<T> {
  code: string;
  results: T;
}
