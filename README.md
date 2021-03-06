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

### JSON and ReadonlyJSON

When dealing with unknown recursive data shapes from a server, you can specify them as JSON or ReadonlyJSON;

```typescript
const x: JSON = {
  hi: {
    there: [
      1, 2, 3, 'a'
    ]
  }
}
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

### Proplist

A proplist is an array of 2-tuples of shape `[string, T]`, often used to represent simple ordered dictionary types and cases where mutiple keys may exist for the same item.  They can be converted to Dicts, but duplicate keys beyond the first will be discarded and ordering will be lost.

```typescript
const myProplist: Proplist<number> = [['a', 1], ['b', 2], ['b', 3]];

const myDict = proplistToDict(myProplist);
// myDict == {
//   a: 1,
//   b: 2
// }

const myOtherProplist = dictToProplist({a: 1, b: 2});
// myOtherProplist == [
//   ['a', 1],
//   ['b', 2],
// ];
// // Order is not guaranteed as Dict is unordered.
```

There is also a MutableProplist type, for times when you need mutability.


### OrderedDict

An OrderedDict is an object that combines the guaranteed order characteristics of an Array with the indexability of a Dict.  They can be created from Dicts (although, bare in mind Dicts are not ordered so you will need to provide a sort, otherwise it will sort alphabetically by key), and from Proplists (which will cause duplicate values to be dropped).  They can also be created from scratch.  It is not recommended as it is error-prone, but you can also initialize them with a list of keys, and a dictionary of items.

```typescript
const orderedDict1 = new OrderedDict<number>();
const orderedDict2 = OrderedDict.fromDict({'a': 1, 'b': 2, 'c': 3});
const orderedDict3 = OrderedDict.fromProplist([['a', 1], ['b', 2], ['c', 3]]);

// Don't do this unless you're really sure
const handInitialized = new OrderedDict<number>(['a', 'b', 'c'], {'a': 1, 'b': 2, 'c': 3});

const orderedDictUpdated = orderedDict2.set('b', 5);
const valueOfB = orderedDictUpdated.get('b');

const orderedDictMerged = orderedDict2.merge(orderedDict3, ([leftKey, leftValue], [rightKey, rightValue]) => leftValue - rightValue);
```

Additional Array-like methods are provided to match the behaviour of native Arrays.

## Code of conduct

For guidelines regarding the code of conduct when contributing to this repository please review [https://www.dabapps.com/open-source/code-of-conduct/](https://www.dabapps.com/open-source/code-of-conduct/)
