/**
 * 存储器
 * 用于存放所有埋点数据
 * appName app名字，必须
 * maxSize 最大存放种类，必须
 * maxWidth 最大并发数量
 * localization 本地化对象，必须实现getItem和setItem方法
 */
export class StoreArea {
  private appName: string;
  private localization: Storage | undefined;
  private maxSize: number = 6;
  private width: number = 0;
  private maxWidth: number = 6;
  private storage: Map<string, Array<any>> = new Map();
  private demandList: Array<string> = [];

  constructor(appName: string, maxSize?: number, maxWidth?: number, localization?: Storage) {
    this.appName = appName;
    if (maxSize) this.maxSize = maxSize;
    if (maxWidth) this.maxWidth = maxWidth;
    if (localization) {
      this.localization = localization;
      this.storage = new Map(JSON.parse(this.localization.getItem(appName) || ''));
    }
  }

  createStore(storeName: string): void {
    if (this.storage.has(storeName) && this.storage.size >= this.maxSize) {
      return;
    }
    this.storage.set(storeName, new Array());
  }

  delStore(storeName: string): void {
    if (this.storage.has(storeName)) {
      this.storage.delete(storeName);
    }
  }

  demand(storeName: string): any {
    if (this.storage.has(storeName) && this.width < this.maxWidth) {
      let arrStore: Array<any> | undefined = this.storage.get(storeName);
      if (arrStore && arrStore.length > 0) {
        this.width++;
        let point = arrStore.shift();
        this.demandList.push(point.demandId);
        if (this.localization) {
          this.localization.setItem(`${this.appName}`, JSON.stringify([...this.storage]));
        }
        return point;
      }
    }
    return null;
  }

  remand(demandId: string): void {
    let index = this.demandList.indexOf(demandId);
    if (index > -1) {
      this.demandList.splice(index, 1);
      this.width--;
    }
  }

  store(storeName: string, point: any): boolean {
    if (!this.storage.has(storeName)) {
      this.createStore(storeName);
    }
    let arrStore: Array<any> | undefined = this.storage.get(storeName);
    if (arrStore) {
      point.demandId = `${storeName}_${Math.random().toString(32).substring(2)}${new Date().getTime()}`;
      arrStore.push(point);
      if (this.localization) {
        this.localization.setItem(`${this.appName}`, JSON.stringify([...this.storage]));
      }
      return true;
    }
    return false;
  }
}
 