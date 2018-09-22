import { Dict, Pairs } from './core';

export type Proplist<T> = Pairs<string, T>;

export function proplistToDict<T>(proplist: Proplist<T>): Dict<T> {
  return proplist.reduce((memo, [key, value]) => {
    return {
      ...memo,
      [key]: value,
    };
  }, {});
}

export function dictToProplist<T>(dict: Dict<T>): Proplist<T> {
  return Object.keys(dict).reduce(
    (memo, key): Proplist<T> => [...memo, [key, dict[key]]],
    []
  );
}
