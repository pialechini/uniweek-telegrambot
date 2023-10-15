import cacheDriver from "@/cache";

export class CacheFor<T> {
  constructor(public scope: string) {
    this.scope = scope;
  }

  remember(key: string | number, data: T) {
    cacheDriver.set(`${this.scope}${key}`, data, 0);
  }

  retreive(key: string | number) {
    return cacheDriver.get(key) as T | undefined;
  }

  forget(key: string | number) {
    cacheDriver.del(`${this.scope}${key}`);
  }
}
