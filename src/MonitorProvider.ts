import { Store } from "./Store";
import { before, after } from "./decorators/LifeCycle";
import { Infos } from "./typings";
import { getBasicInfo } from "./tools";
import { Logger } from "./decorators/Logger";

export class MonitorProvider {
  /**
   * 静态数据，添加后每个生成的埋点都会携带，除非主动发生改变
   */
  private store: Store;

  constructor(store: Store) {  
    this.store = store;
  }

  mountStore(store: Store) {
    this.store = store;
  }

  @before
  @after
  @Logger
  async track(params: Infos) {
    params = {
      ...getBasicInfo(),
      ...params
    }
    if (this.store) this.store.push(params);
    return this;
  }
}
