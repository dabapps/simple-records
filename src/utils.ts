import { ObjectKeys } from './core';

export function recordOrUndefined<T extends ObjectKeys, U extends ObjectKeys>(
  data: T | undefined,
  constructorFunction: (input: T) => U
): U | undefined {
  if (data !== undefined) {
    return constructorFunction(data);
  }
  return undefined;
}

export function recordOrNull<T extends ObjectKeys, U extends ObjectKeys>(
  data: T | null,
  constructorFunction: (input: T) => U
): U | null {
  if (data !== null) {
    return constructorFunction(data);
  }
  return null;
}

export function recordOrId<T extends ObjectKeys, U extends ObjectKeys>(
  data: T | string,
  constructorFunction: (input: T) => U
): U | string {
  if (typeof data !== 'string') {
    return constructorFunction(data as T);
  }
  return data as string;
}

export function recordArray<T extends ObjectKeys, U extends ObjectKeys>(
  data: ReadonlyArray<T> | undefined,
  ctor: (item: T) => U
): ReadonlyArray<U> {
  if (!data) {
    return [];
  }
  return data.map(item => ctor(item));
}

export function recordOrIdArray<T extends ObjectKeys, U extends ObjectKeys>(
  data: ReadonlyArray<Partial<T>> | ReadonlyArray<string>,
  constructor: (item: Partial<T>) => U
): ReadonlyArray<U> | ReadonlyArray<string> {
  const first = data[0];

  if (typeof first === 'string') {
    return data as ReadonlyArray<string>;
  } else {
    return (data as ReadonlyArray<Partial<T>>).map(item => constructor(item));
  }
}

export function narrowToRecord<T>(input: T | string): T {
  if (typeof input === 'string') {
    throw new Error(
      `Tried to narrow an ID into a Record - ${typeof input} ${input}`
    );
  }
  return input as T;
}

export function narrowToRecordArray<T>(
  input: ReadonlyArray<T> | ReadonlyArray<string>
): ReadonlyArray<T> {
  if (input.length === 0) {
    return [];
  }
  const first = input[0];

  if (typeof first === 'string') {
    throw new Error('Tried to narrow an Array of IDs');
  }
  return input as ReadonlyArray<T>;
}
