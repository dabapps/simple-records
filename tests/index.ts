import {
  narrowToRecord,
  narrowToRecordArray,
  recordArray,
  recordOrId,
  recordOrIdArray,
  recordOrNull,
  recordOrUndefined,
  RecordWithConstructor,
  SimpleRecord,
} from '../src/';

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

describe('recordOrUndefined', () => {
  it('should provide us with a constructed record if data is available', () => {
    const item = recordOrUndefined({}, MySimpleRecord);
    expect((item as any).a).toBe(5);
  });

  it('should provide us with undefined if no data is available', () => {
    const item = recordOrUndefined(undefined, MySimpleRecord);
    expect(item).toBe(undefined);
  });
});

describe('recordOrNull', () => {
  it('should provide us with a constructed record if data is available', () => {
    const item = recordOrNull({}, MySimpleRecord);
    expect((item as any).a).toBe(5);
  });

  it('should provide us with null if no data is available', () => {
    const item = recordOrNull(null, MySimpleRecord);
    expect(item).toBe(null);
  });
});

describe('recordOrId', () => {
  it('should provide us with a constructed record if data is available', () => {
    const item = recordOrId({}, MySimpleRecord);
    expect((item as any).a).toBe(5);
  });

  it('should provide us with a string if only a string is available', () => {
    const item = recordOrId('12345', MySimpleRecord);
    expect(item).toBe('12345');
  });
});

describe('recordArray', () => {
  it('should lift our Record constructor across an array', () => {
    const items = recordArray([{}, {}], MySimpleRecord);
    expect(items[0].a).toBe(5);
    expect(items[1].a).toBe(5);
  });
});

describe('recordOrIdArray', () => {
  it('should provide us with a constructed record array if data is available', () => {
    const items = recordOrIdArray([{}, {}], MySimpleRecord);
    expect((items[0] as any).a).toBe(5);
    expect((items[1] as any).a).toBe(5);
  });

  it('should provide us with a string array if only a string is available', () => {
    const items = recordOrIdArray(['1', '2'], MySimpleRecord);
    expect(items[0]).toBe('1');
    expect(items[1]).toBe('2');
  });
});

describe('narrowToRecord', () => {
  it('should give us a record if one is available', () => {
    const item = narrowToRecord(MySimpleRecord());
    expect(item.a).toBe(5);
  });

  it('should throw if no record is available', () => {
    expect(() => {
      narrowToRecord('5');
    }).toThrow();
  });
});

describe('narrowToRecordArray', () => {
  it('should give us a record array if one is available', () => {
    const items = narrowToRecordArray([MySimpleRecord()]);
    expect(items[0].a).toBe(5);
  });

  it('should throw if no record array is available', () => {
    expect(() => {
      narrowToRecordArray(['5', '6']);
    }).toThrow();
  });
});
