import { Dict } from './dict';

export type Proplist<T> = ReadonlyArray<[string, T]>;

export function proplistToDict<T>(proplist: Proplist<T>): Dict<T> {
  return proplist.reduce((memo, [key, value]) => {
    return {
      ...memo,
      [key]: value,
    };
  }, {});
}

export function dictToProplist<T>(dict: Dict<T>): Proplist<T> {
  let result: Proplist<T> = [];
  for (const key of Object.keys(dict)) {
    result = [...result, [key, dict[key]]];
  }
  return result;
}
