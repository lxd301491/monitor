import { Store } from "./Store";
import { before, after } from "./decorators/LifeCycle";
import _ from "lodash";
import { Infos, basicInfo } from "./typings";
import { getUniqueInfo, getConnection } from "./tools";

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
  async track(params: Infos) {
    params = {
      ...params,
      ...getConnection()
    }
    if (this.store) this.store.push(params);
    return this;
  }
}
