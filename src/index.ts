export type Maybe<T> = T | undefined | null;

export interface ISyncAdapter<T> {
  read: () => Maybe<T>;
  write: (data: Maybe<T>) => void;
}

export interface IAdapter<T> {
  read: () => Promise<Maybe<T>>;
  write: (data: Maybe<T>) => Promise<void>;
}

class MissingAdapterError extends Error {
  constructor() {
    super();
    this.message = 'Missing Adapter';
  }
}

export default class UnderDB<T = unknown> {
  public adapter: IAdapter<T>;
  public data: Maybe<T>;

  constructor(adapter: IAdapter<T>) {
    if (adapter) {
      this.adapter = adapter;
    } else {
      throw new MissingAdapterError();
    }
  }

  public async read(): Promise<void> {
    this.data = await this.adapter.read();
  }

  public write(): Promise<void> {
    return this.adapter.write(this.data);
  }

  static sync = class<U = unknown> {
    public adapter: ISyncAdapter<U>;
    public data: Maybe<U>;

    constructor(adapter: ISyncAdapter<U>) {
      this.adapter = adapter;
    }

    public read(): void {
      this.data = this.adapter.read();
    }

    public write(): void {
      return this.adapter.write(this.data);
    }
  };
}
