# Simple Records

**Simple Readonly Typescript records**

[![Build Status](https://travis-ci.com/dabapps/simple-records.svg?token=Vjwq9pDHXxGNhnyuktQ5&branch=master)](https://travis-ci.com/dabapps/simple-records)

This repo provides a number of helper functions for working with Typescript ReadOnly objects.


**Dict**

Dict is a simple type alias for a Readonly Object with arbitrary string keys.

```typescript
const x: Dict<string> = {
  arbitrary: 'data',
};

```

**SimpleRecord**

SimpleRecord creates a function that produces a given Readonly interface, with default values for keys that aren't provided.

```typescript
type IMyRecord = Readonly<{
  a: string;
  b: number;
}>;

const MyRecord = SimpleRecord<IMyRecord>({
  a: 'default string for a',
  b: 0
});

const myInstance = MyRecord({
  b: 5
});

// myInstance == {
//   a: 'default string for a',
//   b: 5
// }
```

**RecordWithConstructor**

RecordWithConstructor takes an input interface of raw data, an output interface of completed data, a set of defaults for the input, and a callback function that must translate between the two types. This is used for when you have complex types (such as nested records, or Moment objects).

```typescript
type IMyRecordInput = Readonly<{
  a: string;
  b: string | Date;
}>;

type IMyRecord = Readonly<{
  a: string;
  b: moment.Moment;
}>;

const MyRecord = RecordWithConstructor<IMyRecordInput, IMyRecord>({
  a: '',
  b: new Date(),
}, (input) => {
  return {
    ...input,
    b: moment.utc(input.b)
  };
});

const myInstance = MyRecord({b: '1970-01-01'});
// myInstance.b is now a Moment object
```
