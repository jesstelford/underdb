import { ISyncAdapter, Maybe } from '../';

export default class LocalStorage<T> implements ISyncAdapter<T> {
  public key: string;

  constructor(key: string) {
    this.key = key;
  }

  public read(): Maybe<T> {
    const value = localStorage.getItem(this.key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value);
  }

  public write(data: Maybe<T>): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }
}
