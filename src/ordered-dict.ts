import { Dict } from './core';
import { dictToProplist, MutableProplist, Proplist } from './proplists';

export type Sort<T> = (a: [string, T], b: [string, T]) => number;

export class OrderedDict<T> {
  public static defaultSort = (a: [string, any], b: [string, any]) =>
    a[0].localeCompare(b[0]);

  public static fromProplist<T>(proplist: Proplist<T>): OrderedDict<T> {
    const { keys, values } = proplist.reduce(
      (memo: { keys: ReadonlyArray<string>; values: Dict<T> }, [k, v]) => {
        return { keys: [...memo.keys, k], values: { ...memo.values, [k]: v } };
      },
      { keys: [], values: {} }
    );
    return new OrderedDict(keys, values);
  }

  public static fromDict<T>(
    dict: Dict<T>,
    sortFunction: Sort<T> = OrderedDict.defaultSort
  ): OrderedDict<T> {
    const proplist = dictToProplist(dict) as Array<[string, T]>;
    proplist.sort(sortFunction);
    return OrderedDict.fromProplist(proplist);
  }

  // tslint:disable-next-line variable-name
  private _keys: ReadonlyArray<string> = [];
  // tslint:disable-next-line variable-name
  private _values: Dict<T> = {};

  constructor(keys: ReadonlyArray<string> = [], values: Dict<T> = {}) {
    this._keys = keys;
    this._values = values;
  }

  public toDict(): Dict<T> {
    return this._values;
  }

  public toProplist(): MutableProplist<T> {
    return this._keys.map(key => {
      return [key, this._values[key]] as [string, T];
    });
  }

  public values(): ReadonlyArray<T> {
    return this._keys.map(key => this._values[key]);
  }

  public keys(): ReadonlyArray<string> {
    return this._keys;
  }

  public set(key: string, value: T): OrderedDict<T> {
    if (this._keys.indexOf(key) > -1) {
      return new OrderedDict(this._keys, { ...this._values, [key]: value });
    } else {
      return new OrderedDict([...this._keys, key], {
        ...this._values,
        [key]: value,
      });
    }
  }

  public merge<U>(other: OrderedDict<U>, sort?: Sort<T>): OrderedDict<T | U> {
    const filtered = other.keys().filter(key => this._keys.indexOf(key) === -1);
    const result = new OrderedDict([...this._keys, ...filtered], {
      ...this._values,
      ...other.toDict(),
    });
    return sort ? result.sort(sort) : result;
  }

  public sort(sort: Sort<T> = OrderedDict.defaultSort): OrderedDict<T> {
    return OrderedDict.fromProplist(this.toProplist().sort(sort));
  }

  public get(key: string): T | undefined;
  public get(key: string, defaultValue: T): T;
  public get(key: string, defaultValue?: T): T | undefined {
    const result = this._values[key];
    return typeof result === 'undefined' ? defaultValue : result;
  }

  public first() {
    return this._values[this._keys[0]];
  }

  public last() {
    return this._values[this._keys[this._keys.length - 1]];
  }

  public index(idx: number): T | undefined {
    if (idx < 0 || idx >= this._keys.length) {
      return undefined;
    }
    return this.get(this._keys[idx]);
  }

  public delete(keyToDelete: string): OrderedDict<T> {
    const items: MutableProplist<T> = [];
    this._keys.forEach(key => {
      if (keyToDelete !== key) {
        items.push([key, this._values[key]]);
      }
    });
    return OrderedDict.fromProplist(items);
  }

  public forEach<U>(callback: (value: T, key: string, index: number) => U) {
    this._keys.forEach((key, index): [string, U] => {
      return [key, callback(this._values[key], key, index)];
    });
  }

  public map<U>(
    callback: (value: T, key: string, index: number) => U
  ): OrderedDict<U> {
    const items: Proplist<U> = this._keys.map((key, index): [string, U] => {
      return [key, callback(this._values[key], key, index)];
    });
    return OrderedDict.fromProplist(items);
  }

  public filter(
    callback: (value: T, key: string, index: number) => boolean
  ): OrderedDict<T> {
    const items: MutableProplist<T> = [];
    this._keys.forEach((key, index) => {
      if (callback(this._values[key], key, index)) {
        items.push([key, this._values[key]]);
      }
    });
    return OrderedDict.fromProplist(items);
  }

  public reduce<U>(
    callback: (memo: U, value: T, key: string, index: number) => U,
    initial: U
  ): U {
    let result = initial;
    this._keys.forEach((key, index) => {
      result = callback(result, this._values[key], key, index);
    });
    return result;
  }

  public some(
    callback: (value: T, key: string, index: number) => boolean
  ): boolean {
    let index = 0;
    for (const key of this._keys) {
      if (callback(this._values[key], key, index)) {
        return true;
      }
      index++;
    }
    return false;
  }

  public all(
    callback: (value: T, key: string, index: number) => boolean
  ): boolean {
    let index = 0;
    for (const key of this._keys) {
      if (!callback(this._values[key], key, index)) {
        return false;
      }
      index++;
    }
    return true;
  }

  public find(
    callback: (value: T, key: string, index: number) => boolean
  ): T | undefined {
    let index = 0;
    for (const key of this._keys) {
      if (callback(this._values[key], key, index)) {
        return this._values[key];
      }
      index++;
    }
    return undefined;
  }

  public findIndex(
    callback: (value: T, key: string, index: number) => boolean
  ): number {
    let index = 0;
    for (const key of this._keys) {
      if (callback(this._values[key], key, index)) {
        return index;
      }
      index++;
    }
    return -1;
  }

  public findKey(
    callback: (value: T, key: string, index: number) => boolean
  ): string | undefined {
    let index = 0;
    for (const key of this._keys) {
      if (callback(this._values[key], key, index)) {
        return key;
      }
      index++;
    }
    return undefined;
  }

  public indexOf(item: T): number {
    let index = 0;
    for (const key of this._keys) {
      if (item === this._values[key]) {
        return index;
      }
      index++;
    }
    return -1;
  }

  public keyOf(item: T): string | undefined {
    for (const key of this._keys) {
      if (item === this._values[key]) {
        return key;
      }
    }
    return undefined;
  }

  public get length(): number {
    return this._keys.length;
  }
}
