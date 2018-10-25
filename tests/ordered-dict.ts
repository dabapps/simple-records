import { OrderedDict, Proplist } from '../src/';

describe('OrderedDict', () => {
  const inputProplist: Proplist<number> = [['b', 2], ['a', 1], ['c', 3]];
  const inputDict = { a: 1, b: 2, c: 3 };

  it('should be constructable', () => {
    const od = new OrderedDict<{}>();
    expect(od instanceof OrderedDict).toBe(true);
  });

  describe('fromDict', () => {
    it('should be constructable from a Dict', () => {
      const od = OrderedDict.fromDict(inputDict);
      expect(od instanceof OrderedDict).toBe(true);
    });

    it('should be sortable on construction', () => {
      const od = OrderedDict.fromDict(
        inputDict,
        ([aKey, aValue], [bKey, bValue]) => bValue - aValue
      );
      expect(od instanceof OrderedDict).toBe(true);
      expect(od.keys()).toEqual(['c', 'b', 'a']);
    });
  });

  it('should be constructable from a Proplist', () => {
    const od = OrderedDict.fromProplist(inputProplist);
    expect(od instanceof OrderedDict).toBe(true);
  });

  it('should be possible to get values out using toDict', () => {
    const od = OrderedDict.fromDict(inputDict);
    const output = od.toDict();
    expect(output).toEqual(inputDict);
  });

  it('should be possible to get values out using toProplist', () => {
    const od = OrderedDict.fromProplist(inputProplist);
    const output = od.toProplist();
    expect(output).toEqual(inputProplist);
  });

  it('should preserve order when using values', () => {
    const od = OrderedDict.fromProplist(inputProplist);
    const output = od.values();
    expect(output).toEqual([2, 1, 3]);
  });

  it('should preserve order when using keys', () => {
    const od = OrderedDict.fromProplist(inputProplist);
    const output = od.keys();
    expect(output).toEqual(['b', 'a', 'c']);
  });

  it('should allow for deletion', () => {
    const od = OrderedDict.fromDict(inputDict);
    const output = od.delete('b').toDict();
    expect(output).toEqual({ a: 1, c: 3 });
  });

  it('should have a defined length', () => {
    const od = OrderedDict.fromDict(inputDict);
    expect(od.length).toEqual(3);
  });

  describe('get', () => {
    it('should return a value', () => {
      const od = OrderedDict.fromProplist(inputProplist);
      expect(od.get('a')).toBe(1);
    });

    it('should return undefined', () => {
      const od = OrderedDict.fromProplist(inputProplist);
      expect(od.get('z')).toBeUndefined();
    });

    it('should return a default', () => {
      const od = OrderedDict.fromProplist(inputProplist);
      expect(od.get('z', 20)).toBe(20);
    });
  });

  describe('index', () => {
    it('should return a value', () => {
      const od = OrderedDict.fromProplist(inputProplist);
      expect(od.index(2)).toBe(3);
    });

    it('should return undefined', () => {
      const od = OrderedDict.fromProplist(inputProplist);
      expect(od.index(8)).toBeUndefined();
    });
  });

  describe('indexOf', () => {
    it('should get the index of an item', () => {
      const od = OrderedDict.fromProplist(inputProplist);
      expect(od.indexOf(3)).toBe(2);
    });

    it("should return -1 for something that doesn't exist", () => {
      const od = OrderedDict.fromProplist(inputProplist);
      expect(od.indexOf(0.5)).toBe(-1);
    });
  });

  describe('keyOf', () => {
    it('should get the key of an item', () => {
      const od = OrderedDict.fromProplist(inputProplist);
      expect(od.keyOf(3)).toBe('c');
    });

    it("should return -1 for something that doesn't exist", () => {
      const od = OrderedDict.fromProplist(inputProplist);
      expect(od.keyOf(0.5)).toBe(undefined);
    });
  });

  describe('set', () => {
    const od = OrderedDict.fromProplist(inputProplist);

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

  describe('sort', () => {
    const od = OrderedDict.fromProplist(inputProplist);

    it('should have a default sort', () => {
      expect(od.sort().keys()).toEqual(['a', 'b', 'c']);
    });

    it('should take a sort param', () => {
      expect(
        od
          .sort(
            ([keyLeft, valueLeft], [keyRight, valueRight]) =>
              valueRight - valueLeft
          )
          .keys()
      ).toEqual(['c', 'b', 'a']);
    });
  });

  describe('sortBy', () => {
    const inputObjectProplist: Proplist<Readonly<{ value: number }>> = [
      ['b', { value: 2 }],
      ['a', { value: 1 }],
      ['c', { value: 3 }],
    ];
    const od = OrderedDict.fromProplist(inputObjectProplist);

    it('should have a default sort', () => {
      expect(od.sortBy(item => item.value).keys()).toEqual(['a', 'b', 'c']);
    });

    it('should take a sort param', () => {
      expect(
        od
          .sortBy(
            item => item.value,
            ([keyLeft, valueLeft], [keyRight, valueRight]) =>
              valueRight - valueLeft
          )
          .keys()
      ).toEqual(['c', 'b', 'a']);
    });
  });

  describe('merge', () => {
    it('should ignore duplicates', () => {
      const od = OrderedDict.fromProplist(inputProplist);
      const pl = od.merge(od).toProplist();
      expect(pl).toEqual(inputProplist);
    });

    it('should append new items', () => {
      const input2: Proplist<number> = [['d', 4], ['aa', 1]];
      const od = OrderedDict.fromProplist(inputProplist);
      const od2 = OrderedDict.fromProplist(input2);
      const pl = od.merge(od2).toProplist();
      expect(pl).toEqual(inputProplist.concat(input2));
    });

    it('should overwrite values', () => {
      const input2: Proplist<number> = [['b', 3], ['a', 1], ['c', 3]];
      const od = OrderedDict.fromProplist(inputProplist);
      const od2 = OrderedDict.fromProplist(input2);
      const pl = od.merge(od2).toProplist();
      expect(pl).toEqual(input2);
    });

    it('should take a sort function', () => {
      const input2: Proplist<number> = [['d', 4]];
      const od = OrderedDict.fromProplist(inputProplist);
      const od2 = OrderedDict.fromProplist(input2);
      expect(
        od
          .merge(od2, ([aKey, aValue], [bKey, bValue]) => bValue - aValue)
          .keys()
      ).toEqual(['d', 'c', 'b', 'a']);
    });
  });

  describe('functional', () => {
    it('should return the first value correctly', () => {
      const od = OrderedDict.fromDict(inputDict);
      expect(od.first()).toEqual(1);
    });

    it('should return the last value correctly', () => {
      const od = OrderedDict.fromDict(inputDict);
      expect(od.last()).toEqual(3);
    });

    it('should forEach correctly', () => {
      const od = OrderedDict.fromDict(inputDict);
      const copy: Array<[string, number]> = [];
      od.forEach((value, key) => copy.push([key, value]));
      expect(copy).toEqual([['a', 1], ['b', 2], ['c', 3]]);
    });

    it('should map correctly', () => {
      const od = OrderedDict.fromDict(inputDict);
      const output = od.map(value => String(value)).toDict();
      expect(output).toEqual({ a: '1', b: '2', c: '3' });
    });

    it('should filter correctly', () => {
      const od = OrderedDict.fromDict(inputDict);
      const output = od.filter(value => value < 3).toDict();
      expect(output).toEqual({ a: 1, b: 2 });
    });

    describe('reduce', () => {
      it('should reduce correctly', () => {
        const od = OrderedDict.fromDict(inputDict);
        const output = od.reduce((memo, value) => memo + value, 0);
        expect(output).toEqual(6);
      });

      it('should reduce in order', () => {
        const od = OrderedDict.fromDict(inputDict);
        const output = od.reduce<ReadonlyArray<number>>(
          (memo, value) => memo.concat([value]),
          []
        );
        expect(output).toEqual([1, 2, 3]);
      });
    });

    describe('some', () => {
      it('should return true if we have a match', () => {
        const input = { a: 1, b: 2, c: 3 };
        const od = OrderedDict.fromDict(input);
        expect(od.some(item => item > 2)).toBe(true);
      });

      it("should return false if we don't have a match", () => {
        const od = OrderedDict.fromDict(inputDict);
        expect(od.some(item => item > 3)).toBe(false);
      });
    });

    describe('every', () => {
      it('should return true if we have all matches', () => {
        const od = OrderedDict.fromDict(inputDict);
        expect(od.every(item => item > 0)).toBe(true);
      });

      it("should return false if we don't have all matches", () => {
        const od = OrderedDict.fromDict(inputDict);
        expect(od.every(item => item > 1)).toBe(false);
      });
    });

    describe('find', () => {
      it('should return an instance', () => {
        const od = OrderedDict.fromDict(inputDict);
        expect(od.find(item => item > 1)).toBe(2);
      });

      it('should return undefined', () => {
        const od = OrderedDict.fromDict(inputDict);
        expect(od.find(item => item > 3)).toBeUndefined();
      });
    });

    describe('findIndex', () => {
      it('should return an index', () => {
        const od = OrderedDict.fromDict(inputDict);
        expect(od.findIndex(item => item > 1)).toBe(1);
      });

      it('should return -1', () => {
        const od = OrderedDict.fromDict(inputDict);
        expect(od.findIndex(item => item > 3)).toBe(-1);
      });
    });

    describe('findKey', () => {
      it('should return a key', () => {
        const od = OrderedDict.fromDict(inputDict);
        expect(od.findKey(item => item > 1)).toBe('b');
      });

      it('should return undefined', () => {
        const input = { a: 1, b: 2, c: 3 };
        const od = OrderedDict.fromDict(input);
        expect(od.findKey(item => item > 3)).toBeUndefined();
      });
    });
  });
});
