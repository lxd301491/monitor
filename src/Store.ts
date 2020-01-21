/**
 * 存储器
 * 用于存放所有埋点数据
 * appName app名字，必须
 * maxSize 最大存放种类，必须
 * maxWidth 最大并发数量
 * localization 本地化对象，必须实现getItem和setItem方法
 */
import localForage from 'localforage';

export class Store {
  private appName: string;
  private store: LocalForage;

  constructor(appName: string) {
    this.appName = appName;
    this.store = localForage.createInstance({
      name: appName,
      storeName: appName
    });
  }

  destory () {
    this.store.dropInstance({
      name: this.appName,
      storeName: this.appName
    });
  }

  async shiftMore(size: number = 15): Promise<string> {
    let items : Array<any> | string = [];
    let len = await this.length();
    len = size > len ? len : size;
    while (--len > -1) {
      items.push(await this._shift());
    }
    if (items.length === 0) {
      return "";
    } 
    items = JSON.stringify(items);
    return items;
  }

  private async _shift () {
    let item = "";
    let key = (await this.keys()).shift() || "";
    item = await this.store.getItem(key);
    await this.store.removeItem(key);
    return item;
  }

  async push<T> (item: T) {
    let key = this.appName + "_" + new Date().getTime();
    await this.store.setItem(key, item);
  }

  async length () {
    return await this.store.length();
  }

  async clear () {
    return await this.store.clear();
  }

  async keys () {
    return await this.store.keys();
  }

  async iterate<T, U> (iteratee: (value: T, key: string, iterationNumber: number) => U) {
    return await this.store.iterate(iteratee);
  }

  async customDriver (driver: LocalForageDriver) {
    this.store.defineDriver(driver);
  }
}
 