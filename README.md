# Simple Records

**Simple Readonly TypeScript Records**

[![Build Status](https://travis-ci.com/dabapps/simple-records.svg?token=Vjwq9pDHXxGNhnyuktQ5&branch=master)](https://travis-ci.com/dabapps/simple-records)

This module provides a number of helper functions for working with TypeScript ReadOnly objects.

## Disclaimer

This module is in its early stages and until it reaches its first major version it may be unstable, with potentially breaking changes with new minor version releases.

Patch version changes will include both minor changes and patches.

## Installation

Install via NPM:

```shell
npm install @dabapps/simple-records --save
```

If you are using a version of npm that doesn't support package lock files, we'd recommend installing with the `--save-exact` flag to pin to a specific version in your package.json.

## Available interfaces

### Dict

Dict is a simple type alias for a Readonly Object with arbitrary string keys.

```typescript
const x: Dict<string> = {
  arbitrary: 'data',
};

```

### SimpleRecord

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

### RecordWithConstructor

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
