import fs from 'fs';
import mutexify from 'mutexify';
import writeFileAtomic from 'write-file-atomic';
import { IAdapter, Maybe } from '../';

export default class JSONFile<T> implements IAdapter<T> {
  public file: string;
  private lock = mutexify();

  constructor(file: string) {
    this.file = file;
  }

  public read(): Promise<Maybe<T>> {
    return new Promise<Maybe<T>>((resolve, reject) => {
      fs.readFile(this.file, (err, data) => {
        if (err) {
          // File doesn't exist
          if (err.code === 'ENOENT') {
            return resolve(null);
          }

          // Other errors
          return reject(err);
        }

        resolve(JSON.parse(data.toString()));
      });
    });
  }

  public write(data: Maybe<T>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Lock file
      this.lock(release => {
        // Write atomically
        writeFileAtomic(this.file, JSON.stringify(data, null, 2), err => {
          // Release file
          release();

          if (err) {
            return reject(err);
          }

          resolve();
        });
      });
    });
  }
}
