import { Dict, MutablePairs, Pairs } from './core';

export type Proplist<T> = Pairs<string, T>;
export type MutableProplist<T> = MutablePairs<string, T>;

export function proplistToDict<T>(proplist: Proplist<T>): Dict<T> {
  return proplist.reduce((memo, [key, value]) => {
    return {
      [key]: value,
      ...memo,
    };
  }, {});
}

export function dictToProplist<T>(dict: Dict<T>): MutableProplist<T> {
  return Object.keys(dict).reduce(
    (memo: MutableProplist<T>, key): MutableProplist<T> => [
      ...memo,
      [key, dict[key]],
    ],
    []
  );
}

export function proplistGetFirst<T>(
  proplist: Proplist<T>,
  index: string
): T | undefined {
  for (const i in proplist) {
    if (proplist[i][0] === index) {
      return proplist[i][1];
    }
  }
  return undefined;
}
