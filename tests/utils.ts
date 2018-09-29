import {
  narrowToRecord,
  narrowToRecordArray,
  recordArray,
  recordOrId,
  recordOrIdArray,
  recordOrNull,
  recordOrUndefined,
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

  it('should handle empty inputs', () => {
    const items = recordArray(undefined, MySimpleRecord);
    expect(items).toEqual([]);
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

  it('should handle empty arrays', () => {
    const items = narrowToRecordArray([]);
    expect(items).toEqual([]);
  });
});
