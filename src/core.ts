export interface ObjectKeys {
  [key: string]: any;
}

export type Dict<T> = Readonly<{ [key: string]: T }>;
export type Pairs<T, U> = ReadonlyArray<[T, U]>;
export type MutablePairs<T, U> = Array<[T, U]>;

export type JSON = string | number | boolean | null | JSONObject | JSONArray;
export interface JSONObject {
  [x: string]: JSON;
}
export interface JSONArray extends Array<JSON> {}

export type ReadonlyJSON =
  | string
  | number
  | boolean
  | null
  | ReadonlyJSONObject
  | ReadonlyJSONArray;
export interface ReadonlyJSONObject {
  readonly [x: string]: ReadonlyJSON;
}
export interface ReadonlyJSONArray extends ReadonlyArray<ReadonlyJSON> {}
