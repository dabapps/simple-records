import { Dict } from './dict';

export class OrderedDict<T> {
  public static fromProplist() {}

  public static fromDict<T>(
    dict: Dict<T>,
    sortFunction: (a: [string, T], b: [string, T]) => number
  ) {}

  constructor() {
    this.keys = [];
    this.values = {};
  }

  private keys: ReadonlyArray<string> = [];
  private values: Dict<T> = {};
}
