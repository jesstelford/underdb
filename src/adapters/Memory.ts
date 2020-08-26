import { IAdapter, Maybe } from '../';

export default class Memory<T> implements IAdapter<T> {
  private data: Maybe<T> = null;

  public read(): Promise<Maybe<T>> {
    return Promise.resolve(this.data);
  }

  public write(data: Maybe<T>): Promise<void> {
    this.data = data;
    return Promise.resolve();
  }
}
