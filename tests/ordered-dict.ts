import { OrderedDict, Proplist } from '../src/';

describe('OrderedDict', () => {
  it('should be constructable', () => {
    const od = new OrderedDict<{}>();
    expect(od instanceof OrderedDict).toBe(true);
  });

  it('should be constructable from a Dict', () => {
    const od = OrderedDict.fromDict({ a: 1, b: 2, c: 3 });
    expect(od instanceof OrderedDict).toBe(true);
  });

  it('should be constructable from a Proplist', () => {
    const od = OrderedDict.fromProplist([['b', 2], ['a', 1], ['c', 3]]);
    expect(od instanceof OrderedDict).toBe(true);
  });

  it('should be possible to get values out using toDict', () => {
    const input = { a: 1, b: 2, c: 3 };
    const od = OrderedDict.fromDict(input);
    const output = od.toDict();
    expect(output).toEqual(input);
  });

  it('should be possible to get values out using toProplist', () => {
    const input: Proplist<number> = [['b', 2], ['a', 1], ['c', 3]];
    const od = OrderedDict.fromProplist(input);
    const output = od.toProplist();
    expect(output).toEqual(input);
  });

  it('should preserve order when using values', () => {
    const input: Proplist<number> = [['b', 2], ['a', 1], ['c', 3]];
    const od = OrderedDict.fromProplist(input);
    const output = od.values();
    expect(output).toEqual([2, 1, 3]);
  });

  it('should preserve order when using keys', () => {
    const input: Proplist<number> = [['b', 2], ['a', 1], ['c', 3]];
    const od = OrderedDict.fromProplist(input);
    const output = od.keys();
    expect(output).toEqual(['b', 'a', 'c']);
  });

  describe('set', () => {
    const input: Proplist<number> = [['b', 2], ['a', 1], ['c', 3]];
    const od = OrderedDict.fromProplist(input);

    it('should overwrite existing keys', () => {
      const output = od.set('a', 5);
      const pl = output.toProplist();
      expect(pl).toEqual([['b', 2], ['a', 5], ['c', 3]]);
    });

    it('should append if no existing key', () => {
      const output = od.set('d', 5);
      const pl = output.toProplist();
      expect(pl).toEqual([['b', 2], ['a', 1], ['c', 3], ['d', 5]]);
    });
  });

  describe('merge', () => {
    it('should ignore duplicates', () => {
      const input: Proplist<number> = [['b', 2], ['a', 1], ['c', 3]];
      const od = OrderedDict.fromProplist(input);
      const pl = od.merge(od).toProplist();
      expect(pl).toEqual(input);
    });

    it('should append new items', () => {
      const input: Proplist<number> = [['b', 2], ['a', 1], ['c', 3]];
      const input2: Proplist<number> = [['d', 4], ['aa', 1]];
      const od = OrderedDict.fromProplist(input);
      const od2 = OrderedDict.fromProplist(input2);
      const pl = od.merge(od2).toProplist();
      expect(pl).toEqual(input.concat(input2));
    });

    it('should overwrite values', () => {
      const input: Proplist<number> = [['b', 2], ['a', 1], ['c', 3]];
      const input2: Proplist<number> = [['b', 3], ['a', 1], ['c', 3]];
      const od = OrderedDict.fromProplist(input);
      const od2 = OrderedDict.fromProplist(input2);
      const pl = od.merge(od2).toProplist();
      expect(pl).toEqual(input2);
    });

    it('should take a sort function', () => {
      throw new Error('Not implemented');
    });
  });
});
