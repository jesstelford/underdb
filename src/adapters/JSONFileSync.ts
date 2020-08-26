import fs from 'fs';
import writeFileAtomic from 'write-file-atomic';
import { ISyncAdapter, Maybe } from '../';

export default class JSONFileSync<T> implements ISyncAdapter<T> {
  public file: string;

  constructor(file: string) {
    this.file = file;
  }

  public read(): Maybe<T> {
    if (!fs.existsSync(this.file)) {
      return null;
    }

    return JSON.parse(fs.readFileSync(this.file).toString());
  }

  public write(data: Maybe<T>): void {
    writeFileAtomic.sync(this.file, JSON.stringify(data, null, 2));
  }
}
