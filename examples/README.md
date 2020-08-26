# Examples

## CLI

```js
const UnderDB = require("underdb");
const FileSync = require("underdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = new UnderDB.sync(adapter);

db.read();

if (db.data === null) {
  db.data = { posts: [] };
}

db.data.posts.push({ title: process.argv[2] });
db.write();
```

```sh
$ node cli.js hello
$ cat db.json
# { "posts": [ "title": "hello" ] }
```

## Browser

```js
import UnderDB from "underdb";
import LocalStorage from "underdb/adapters/LocalStorage";

const adapter = new LocalStorage("db");
const db = new UnderDB.sync(adapter);

db.read();

if (db.data === null) {
  db.data = { posts: [] };
}

db.data.posts.push({ title: "underdb" });
db.write();
```

## Server

Please **note** that if you're developing a local server and don't expect to get concurrent requests, it's often easier to use `JSONFileSync` adapter.

But if you need to avoid blocking requests, you can do so by using `JSONFile` adapter.

```js
const Koa = require("koa");
const _ = require("koa-route");
const bodyParser = require("koa-bodyparser");

const UnderDB = require("underdb");
const JSONFile = require("underdb/adapters/JSONFile");

const app = new Koa();
const adapter = new JSONFile("db.json");
const db = new UnderDB(adapter)(async () => {
  await db.read();

  if (db.data === null) {
    db.data = { posts: [] };
  }

  app.use(bodyParser());

  app.use(
    _.get("/posts", async ctx => {
      ctx.body = db.data.posts;
    })
  );

  app.use(
    _.get("/posts/:id", async (ctx, id) => {
      const post = db.data.posts.find(post => post.id === id);
      if (!post) {
        return ctx.throw(`Cannot find post with ID ${id}`, 404);
      }
      ctx.body = post;
    })
  );

  app.use(
    _.post("/posts", async ctx => {
      const post = {
        id: Date.now().toString(),
        ...ctx.request.body
      };
      db.data.posts.push(post);
      await db.write();
      ctx.body = post;
    })
  );

  app.listen(8080);
})();
```

## In-memory

With this adapter, calling `write` will do nothing. One use case for this adapter can be for tests.

```js
const fs = require("fs");
const UnderDB = require("underdb");
const FileSync = require("underdb/adapters/FileSync");
const MemorySync = require("underdb/adapters/MemorySync");

const adapter =
  process.env.NODE_ENV === "test" ? new MemorySync() : new FileSync("db.json");

const db = new UnderDB.sync(adapter);
```
