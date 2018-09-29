import { RecordWithConstructor, SimpleRecord } from '../src/';

type ISimpleInterface = Readonly<{
  a: number;
  b: string;
}>;

const MySimpleRecord = SimpleRecord<ISimpleInterface>({
  a: 5,
  b: '--',
});

describe('SimpleRecord', () => {
  it('should provide defaults to an empty constructor', () => {
    const instance = MySimpleRecord();
    expect(instance.a).toBe(5);
    expect(instance.b).toBe('--');
  });

  it('should mix valid data in over defaults', () => {
    const instance = MySimpleRecord({
      b: 'llama',
    });
    expect(instance.a).toBe(5);
    expect(instance.b).toBe('llama');
  });
});

interface IComplexInterfaceShared {
  first: string;
}

type IComplexInterfaceInput = Readonly<
  IComplexInterfaceShared & {
    second: Partial<ISimpleInterface>;
  }
>;
type IComplexInterface = Readonly<
  IComplexInterfaceShared & {
    second: ISimpleInterface;
  }
>;

const MyComplexRecord = RecordWithConstructor<
  IComplexInterfaceInput,
  IComplexInterface
>(
  {
    first: 'first',
    second: {},
  },
  input => {
    return {
      ...input,
      second: MySimpleRecord(input.second),
    };
  }
);

describe('RecordWithConstructor', () => {
  it('should deeply construct my items', () => {
    const instance = MyComplexRecord();
    expect(instance.first).toBe('first');
    expect(instance.second.a).toBe(5);
    expect(instance.second.b).toBe('--');
  });

  it('should provide correctly merged defaults', () => {
    const instance = MyComplexRecord({
      first: 'a',
      second: {
        a: 10,
      },
    });
    expect(instance.first).toBe('a');
    expect(instance.second.a).toBe(10);
    expect(instance.second.b).toBe('--');
  });
});
