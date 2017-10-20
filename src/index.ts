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

export function recordOrUndefined<T, U>(
  data: T | undefined,
  constructorFunction: (input: T) => U
): U | undefined {
  if (data !== undefined) {
    return constructorFunction(data);
  }
  return undefined;
}

export function recordOrNull<T, U>(
  data: T | null,
  constructorFunction: (input: T) => U
): U | null {
  if (data !== null) {
    return constructorFunction(data);
  }
  return null;
}

export function recordOrId<T, U>(
  data: T | string,
  constructorFunction: (input: T) => U
): U | string {
  if (!_.isString(data)) {
    return constructorFunction(data as T);
  }
  return data as string;
}

export function recordArray<T, U>(
  data: ReadonlyArray<T> | undefined,
  ctor: (item: T) => U
): ReadonlyArray<U> {
  if (!data) {
    return [];
  }
  return _.map(data, (item) => ctor(item));
}

export function recordOrIdArray<T, U>(
  data: ReadonlyArray<Partial<T>> | ReadonlyArray<string>,
  constructor: (item: Partial<T>) => U
): ReadonlyArray<U> | ReadonlyArray<string> {
  const first = data[0];

  if (_.isString(first)) {
    return data as ReadonlyArray<string>;
  } else {
    return _.map(data as T[], (item) => constructor(item));
  }
}

export function narrowToRecord<T>(input: T | string): T {
  if (_.isString(input)) {
    throw new Error(
      `Tried to narrow an ID into a Record - ${typeof input} ${input}`
    );
  }
  return input as T;
}

export function narrowToRecordArray<T>(input: ReadonlyArray<T> | ReadonlyArray<string>): ReadonlyArray<T> {
  if (input.length === 0) {
    return [];
  }
  const first = input[0];

  if (_.isString(first)) {
    throw new Error('Tried to narrow an Array of IDs');
  }
  return input as ReadonlyArray<T>;
}
