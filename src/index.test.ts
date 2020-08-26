import fs from 'fs';
import lodash from 'lodash';
import tempy from 'tempy';
import JSONFileAdapter from './adapters/JSONFile';
import UnderDB from './';

function createJSONFile(obj: Record<string, unknown>) {
  const file = tempy.file();
  fs.writeFileSync(file, JSON.stringify(obj));
  return file;
}

describe('UnderDB', () => {
  // TypeScript complains about there being no parameter passed here, so we
  // can't actually run this test
  //test('throws an error if no adapter is provided', () => {
  //  expect(() => new UnderDB()).toThrowError(/adapter/i);
  //});

  test('reads and writes to JSON file', async () => {
    interface IData {
      a?: number;
      b?: number;
    }

    // Create JSON file
    const obj = { a: 1 };
    const file = createJSONFile(obj);

    // Init
    const adapter = new JSONFileAdapter<IData>(file);
    const db = new UnderDB<IData>(adapter);
    await db.read();

    // Data should equal file content
    expect(db.data).toEqual(obj);

    // Write new data
    const newObj = { b: 2 };
    db.data = newObj;
    await db.write();

    // File content should equal new data
    const data = fs.readFileSync(file).toString();
    expect(JSON.parse(data)).toEqual(newObj);
  });

  test('works with lodash', async () => {
    // Create JSON file
    const obj = { todos: ['foo', 'bar'] };
    const file = createJSONFile(obj);

    // Init
    const adapter = new JSONFileAdapter(file);
    const db = new UnderDB(adapter);
    await db.read();
    const lowdb = lodash.chain(db).get('data');

    // Use lodash
    // eslint-disable-next-line
    // @ts-ignore
    const firstTodo = lowdb.get('todos').first().value();

    expect(firstTodo).toBe('foo');
  });
});
