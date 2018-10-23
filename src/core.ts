export interface ObjectKeys {
  [key: string]: any;
}

export type Dict<T> = Readonly<{ [key: string]: T }>;
export type Pairs<T, U> = ReadonlyArray<[T, U]>;
export type MutablePairs<T, U> = Array<[T, U]>;
