import { Dict } from './dict';
import { dictToProplist, Proplist } from './proplist';

type Sort = (
      a: [string, T],
      b: [string, T]
    ) => number;

export class OrderedDict<T> {
  public static defaultSort = (a: [string, any], b: [string, any]) =>
    a[0].localeCompare(b[0]);

  public static fromProplist<T>(proplist: Proplist<T>): OrderedDict<T> {
    const { keys, values } = proplist.reduce(
      (memo, [k, v]) => {
        return { keys: [...memo.keys, k], values: { ...memo.values, [k]: v } };
      },
      { keys: [], values: {} }
    );
    return new OrderedDict(keys, values);
  }

  public static fromDict<T>(
    dict: Dict<T>,
    sortFunction: Sort = OrderedDict.defaultSort
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
    return {
      ...this._values,
    };
  }

  public toProplist(): Proplist<T> {
    return this._keys.map(key => {
      return [key, this._values[key]] as [string, T];
    });
  }

  public values(): ReadonlyArray<T> {
    return this._keys.map(key => this._values[key]);
  }

  public keys(): ReadonlyArray<string> {
    return [...this._keys];
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

  public merge<U>(other: OrderedDict<U>, sort?: Sort): OrderedDict<T | U> {
    const filtered = other.keys().filter(key => this._keys.indexOf(key) === -1);
    return new OrderedDict([...this._keys, ...filtered], {
      ...this._values,
      ...other.toDict(),
    });
  }
}
