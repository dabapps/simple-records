import {
  Dict,
  dictToProplist,
  Proplist,
  proplistGetFirst,
  proplistToDict,
} from '../src/';

describe('proplists', () => {
  describe('proplistGetFirst', () => {
    const myProplist: Proplist<number> = [['a', 1], ['b', 2], ['b', 3]];

    it('should get the first instance of a key', () => {
      expect(proplistGetFirst(myProplist, 'b')).toBe(2);
    });

    it('should handle the key not existing', () => {
      expect(proplistGetFirst(myProplist, 'c')).toBe(undefined);
    });
  });

  describe('proplistToDict', () => {
    it('should convert a proplist into a dictionary', () => {
      const myProplist: Proplist<number> = [['a', 1], ['b', 2]];
      const result = proplistToDict(myProplist);
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });
  describe('dictToProplist', () => {
    it('should convert a dictionary into a proplist', () => {
      const myDict: Dict<number> = { a: 1, b: 2 };
      const result = dictToProplist(myDict);
      expect(result.length).toBe(2);
      expect(proplistGetFirst(result, 'a')).toBe(1);
      expect(proplistGetFirst(result, 'b')).toBe(2);
    });
  });
});
