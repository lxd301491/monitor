import { Store } from "./Store";
import { before, after } from "./decorators/LifeCycle";
import _ from "lodash";
import { Infos, basicInfo } from "./typings";
import { getUniqueInfo } from "./tools";

export class MonitorProvider {
  /**
   * 静态数据，添加后每个生成的埋点都会携带，除非主动发生改变
   */
  private store: Store;
  private basicInfo: basicInfo = {
    uni: getUniqueInfo(),
    page: "",
    uId: "",
    rId: "",
    ct: "",
    msg: "",
    ms: "unkown",
    ml: "info"
  };

  constructor(store: Store) {  
    this.store = store;
  }

  mountStore(store: Store) {
    this.store = store;
  }

  setBasicInfo (basicInfo: {
    uId: string,
    rId: string
  }) {
    this.basicInfo = {
      ...this.basicInfo,
      ...basicInfo
    };
  }

  getBasicInfo(): basicInfo {
    return this.basicInfo;
  }

  @before
  @after
  async track(params: Infos) {
    if (this.store) this.store.push(params);
    return this;
  }
}
