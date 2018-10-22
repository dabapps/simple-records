export class Option<T> {
  readonly kind: 'SOME' | 'NONE';

  public map<U>(callback: (value: T) => U): Option<U> {
    throw new Error('Do not use base Option class');
  }

  public andThen<U>(callback: (value: T) => Option<U>): Option<U> {
    throw new Error('Do not use base Option class');
  }

  public toJS(): T | undefined {
    return undefined;
  }

  public expect(error: string): T {
    throw new Error(error);
  }
}

export class Some<T> extends Option<T> {
  readonly value: T
  readonly kind: 'SOME' = 'SOME';

  constructor(value: T) {
    super();
    this.value = value;
  }

  public map<U>(callback: (value: T) => U): Option<U> {
    return new Some(callback(this.value));
  }

  public andThen<U>(callback: (value: T) => Option<U>): Option<U> {
    return callback(this.value);
  }

  public toJS(): T | undefined {
    return this.value;
  }

  public expect(error: string): T {
    return this.value
  }
}

export class None<T> extends Option<T> {
  readonly kind: 'NONE' = 'NONE';

  public map<U>(callback: (value: T) => U): Option<U> {
    return this as any;
  }

  public andThen<U>(callback: (value: T) => Option<U>): Option<U> {
    return this as any;
  }
}

export function asOption<T>(item: T | undefined): Option<T> {
  if (typeof item === 'undefined') {
    return new None();
  }
  return new Some(item);
}
