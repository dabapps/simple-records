import * as _ from 'underscore';

export type Dict<T> = Readonly<{ [key: string]: T }>;

export function SimpleRecord<T>(
  defaults: T
): (input?: Partial<T>) => Readonly<T> {
  return function record(input?: Partial<T>) {
    // This would be better with Spread, but awaiting a fix
    // https://github.com/Microsoft/TypeScript/issues/13557
    if (input) {
      return _.extend({}, defaults, input);
    }
    return defaults;
  };
}

export function RecordWithConstructor<T, U>(
  defaults: T,
  constructorFunction: (input: T) => Readonly<U>
): (input?: Partial<T>) => Readonly<U> {
  const innerRecord = SimpleRecord<T>(defaults);

  return function record(input?: Partial<T>): U {
    const preTransform = innerRecord(input);
    return constructorFunction(preTransform);
  };
}
