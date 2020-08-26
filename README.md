# UnderDB

> Minimalist JSON database for small projects

```js
db.data.posts.push({ id: 1, title: 'underdb is awesome' });

db.write();
```

```json
{
  "posts": [{ "id": 1, "title": "underdb is awesome" }]
}
```

## Highlights

- Extremely minimalist API
- Query and modify data using plain JS
- TypeScript support out of the box
- Hackable
  - Change storage, file format or add encryption via [adapters](#adapters)
  - Add lodash, ramda, ... for super powers!

## Install

```sh
npm install underdb
```

## Usage

```js
import path from 'path';
import UnderDB from 'underdb';
import JSONFile from 'underdb/adapters/JSONFile';

// Ensure that the path to db.json is not relative to proces.cwd()
const file = path.join(__dirname, 'db.json');

const adapter = new JSONFile(file);
const db = new UnderDB(adapter);

const defaultData = { messages: [] }(async () => {
  // Read data from JSON file, this will set db.data
  await db.read();

  // If db.json doesn't exist, db.data is null
  if (db.data === null) {
    // If db.data is null, set some default data
    // db.data can be anything: object, array, string, ...
    db.data = { messages: [] };
  }

  // Push new message
  db.data.messages.push('hello world');

  // Write to db.data to db.json
  await db.write();
})();
```

```js
// db.json
{
  "messages": [ "hello world" ]
}
```

## API

### Classes

UnderDB comes with 2 classes to be used with asynchronous or synchronous adapters.

#### `new UnderDB(adapter)`

```js
import UnderDB from 'underdb';
import JSONFile from 'underdb/lib/adapters/JSONFile';

const db = new UnderDB(new JSONFile('db.json'));
await db.read();
await db.write();
```

#### `new UnderDB.sync(adapterSync)`

```js
import UnderDB from 'underdb';
import JSONFileSync from 'underdb/lib/adapters/JSONFileSync';

const db = new UnderDB.sync(new JSONFileSync('db.json'));
db.read();
db.write();
```

### Methods

#### read()

Calls `adaper.read()` and sets instance `data`.

**Note** `JSONFile` and `JSONFileSync` adapters will set `data` to `null` if file doesn't exist.

```js
db.data; // === undefined
db.read();
db.data; // !== undefined
```

#### `write()`

Calls `adapter.write(data)` and passes instance `data`

```js
db.data = { posts: [] };
db.write(); // db.json will be { posts: [] }
db.data = {};
db.write(); // db.json will be {}
```

### Properties

#### `data`

`data` is your db state. If you're using the adapters coming with UnderDB, it can be any type supported by [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

```js
db.data = 'string';
db.data = [1, 2, 3];
db.data = { key: 'value' };
```

## Adapters

### Bundled adapters

UnderDB comes with 3 adapters, but you can write your own.

#### lib/adapters/JSONFile

Asynchronous adapter for reading and writng JSON files.

```js
new UnderDB(new JSONFile(file));
```

#### lib/adapters/JSONFile

Synchronous adapter for reading and writng JSON files.

```js
new UnderDB.sync(new JSONFileSync(file));
```

#### lib/adapters/LocalStorage

Synchronous adapter for `window.localStorage` use it with `UnderDB.sync`.

```
new UnderDB.sync(new LocalStorage())
```

## Third-party adapters

- ...
- ...

## Recipes

### Using UnderDB with lodash

In this example, we're going to use lodash but you can apply the same principles to other libraries like ramda.

```js
import lodash from lodash

// After db.read, add a new chain property
db.chain = lodash.chain(db.data)

// And use chain instead of db.data if you want to use the powerful API that lodash provides
db.chain
  .get('messages')
  .first()
  .value()
```

If you're building for the web, and want to make the bundle smaller, you can just use the functions that you need

```js
import find from 'lodash/find';

const message = find(db.data.message, { id: 1 });
```

### Synchronous file operations

If you prefer to write data synchronously, use `UnderDB` and `JSONFileSync`

```js
import UnderDB from 'underdb';
import JSONFileSync from 'underdb/JSONFileSync';

const db = new UnderDB.sync(JSONFile('db.json'));

// db.read and db.write will be synchronous
```

### Creating your own adapter

Adapter let's you persist your data to any storage. By default, UnderDB comes with `JSONFile`, `JSONFileSync` and `LocalStorage` but you can find on npm third-party adapters to store your data to GitHub, Dat, ...

But creating your own is super simple, your adapter just has to provide the following methods:

```js
// If it's asynchronous
read: () => Promise<void>
write: (data: any) => void

// If it's synchronous
read: () => void
write: (data: any) => void
```

For example, let's say you have some remote storage:

```js
import UnderDB from 'underdb';
import api from './MyAsyncStorage';

class MyAsyncAdapter {
  // this is optional but your Adapter could take some arguments
  constructor(someArgs) {
    // ...
  }

  read() {
    return api.read(); // should return a Promise
  }

  write() {
    return api.write(); // should return a Promise
  }
}

const adapter = new MyAsyncAdapter();
const db = new UnderDB(adapter);
```

### Using it with TypeScript

UnderDB comes with definitions files out of the box, but since there's no way of telling what the data will look like you will need to provide an interface via a generic.

```ts
interface IData {
  messages: string[];
}

const db = new UnderDB<IData>(adapter);
```

## Limits

UnderDB isn't meant to scale and doesn't support Cluster.

If you have large JavaScript objects (`~10-100MB`) you may hit some performance issues. This is because whenever you call `write`, the whole object will be serialized and written to the storage.

This can be fine depending on your projects. It can also be mitigated by doing batch operations and calling `write` only when you need it.

But if you plan to scale, it's highly recommended to use databases like `PostgreSQL`, `MongoDB`, ...

## License

MIT
