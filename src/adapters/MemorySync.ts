import { ISyncAdapter, Maybe } from '../';

export default class Memory<T> implements ISyncAdapter<T> {
  private data: Maybe<T> = null;

  public read(): Maybe<T> {
    return this.data;
  }

  public write(data: Maybe<T>): void {
    this.data = data;
  }
}
