import { Option, asOption, Some, None } from '../src/';
describe('Options', () => {

  describe('map', () => {
    const action = (values: Option<string>) =>
      values.map(value => value.concat(value));

    it('should successfully map', () => {
      const result = action(new Some('hello'));
      expect(result.kind).toBe('SOME');
      expect(result.toJS()).toBe('hellohello');
    });

    it('should handle undefined', () => {
      const result = action(new None());
      expect(result.kind).toBe('NONE');
      expect(result.toJS()).toBeUndefined();
    });
  });

  describe('andThen', () => {
    const action = (values: Option<string>) =>
      values.andThen(value => new Some(parseInt(value, 10)));

    it('should successfully transform type', () => {
      const result = action(new Some('10'));
      expect(result.kind).toBe('SOME');
      expect(result.toJS()).toBe(10);
    });

    it('should handle undefined', () => {
      const result = action(new None());
      expect(result.kind).toBe('NONE');
      expect(result.toJS()).toBeUndefined();
    });
  });

  describe('asOption', () => {
    it('should lift a value', () => {
      const result = asOption('a');
      expect(result.kind).toBe('SOME');
      expect(result.toJS()).toBe('a');
    });

    it('should lift an undefined', () => {
      const result = asOption(undefined);
      expect(result.kind).toBe('NONE');
      expect(result.toJS()).toBeUndefined();
    });
  });

  describe('integration test', () => {
    interface myDict {
      a?: {
        b: string
      }
    }

    const dictWithValues: myDict = {
      a: {
        b: 'z'
      }
    };

    const dictMissingValues: myDict = {
      a: undefined
    };

    const optionChainAction = (values: myDict) => asOption(values)
      .andThen(value =>
        asOption(value.a)
      ).map(value =>
        value.b
      ).andThen<string>(value => {
        if (value !== 'z') {
          return new None();
        }
        return new Some('Z');
      }).map(value => value.toLowerCase());

    it('should handle a complex query', () => {
      const optionChain = optionChainAction(dictWithValues);
      expect(optionChain.kind).toBe('SOME');
    });

    it('should return the empty object', () => {
      const optionChain = optionChainAction(dictMissingValues);
      expect(optionChain.kind).toBe('NONE');
    });
  });
});
