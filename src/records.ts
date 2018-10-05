import { ObjectKeys } from './core';

export function SimpleRecord<T extends ObjectKeys>(
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
  T extends ObjectKeys,
  U extends ObjectKeys
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
