export interface IStringKeys {
  [key: string]: any;
}

export type Dict<T> = Readonly<{ [key: string]: T }>;

export function SimpleRecord<T extends IStringKeys>(
  defaults: T
): (input?: Partial<T>) => Readonly<T> {
  return function record(input?: Partial<T>) {
    if (input) {
      return {
        ...(defaults as any),
        ...(input as any),
      };
    }
    return defaults;
  };
}

export function RecordWithConstructor<
  T extends IStringKeys,
  U extends IStringKeys
>(
  defaults: T,
  constructorFunction: (input: T) => Readonly<U>
): (input?: Partial<T>) => Readonly<U> {
  const innerRecord = SimpleRecord<T>(defaults);

  return function record(input?: Partial<T>): U {
    const preTransform = innerRecord(input);
    return constructorFunction(preTransform);
  };
}

export function recordOrUndefined<T extends IStringKeys, U extends IStringKeys>(
  data: T | undefined,
  constructorFunction: (input: T) => U
): U | undefined {
  if (data !== undefined) {
    return constructorFunction(data);
  }
  return undefined;
}

export function recordOrNull<T extends IStringKeys, U extends IStringKeys>(
  data: T | null,
  constructorFunction: (input: T) => U
): U | null {
  if (data !== null) {
    return constructorFunction(data);
  }
  return null;
}

export function recordOrId<T extends IStringKeys, U extends IStringKeys>(
  data: T | string,
  constructorFunction: (input: T) => U
): U | string {
  if (typeof data !== 'string') {
    return constructorFunction(data as T);
  }
  return data as string;
}

export function recordArray<T extends IStringKeys, U extends IStringKeys>(
  data: ReadonlyArray<T> | undefined,
  ctor: (item: T) => U
): ReadonlyArray<U> {
  if (!data) {
    return [];
  }
  return data.map(item => ctor(item));
}

export function recordOrIdArray<T extends IStringKeys, U extends IStringKeys>(
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
