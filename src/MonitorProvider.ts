import { VariableExp } from "./VariableExp";
import { Store } from "./Store";
import { before, after } from "./decorators/LifeCycle";
import _ from "lodash";

const limits: {[key: string]: number} = {
  userId: 20,
  roleId: 20,
  roleArr: 400,
  isWhite: 2,
  scc: 20,
  deviceId: 40,
  device: 40,
  system: 20,
  webview: 40,
  appVersion: 20,
  patchVersion: 400,
  network: 100,
  userAgent: 400,
  actionLevel: 20,
  action: 400,
  actionGroup: 100,
  actionStack: 100,
  actionTime: 20,
  routeData: 400,
  url: 200,
  referrer: 200,
  cpu: 20,
  memory: 20,
  disk: 20,
  jsErrorMessage: 200,
  jsErrorLineNo: 10,
  jsErrorColumnNo: 10,
  jsErrorStack: 4000,
  jsErrorFilename: 200
};

export class MonitorProvider {
  /**
   * 静态数据，添加后每个生成的埋点都会携带，除非主动发生改变
   */
  private eternals: Map<string, VariableExp> = new Map<string, VariableExp>();
  private store: Store;
  private limits: any = limits;

  constructor(store: Store) {  
    this.store = store;
  }

  mountStore(store: Store) {
    this.store = store;
  } 

  mergeEternal(params: {[key: string]: any}) {
    for (const key in params) {
      this.eternals.set(key, new VariableExp(params[key]));
    }
    return this;
  }

  mergeLimit (limits: {[key: string]: number}) {
    _.extend(this.limits, limits);
    return this;
  }

  setCommonLimits(limits: any) {
    this.limits = limits;
  }

  @before
  @after
  async track(params: any, limits?: {[key: string]: number}) {
    let emitObj: any = {};
    this.eternals.forEach(async (value, key) => {
      emitObj[key] = await value.toString((limits && limits[key]) || this.limits[key]);
    });
    for (const key in params) {
      emitObj[key] = await new VariableExp(
        params[key]
      ).toString((limits && limits[key]) || this.limits[key]);
    }
    if (this.store) this.store.push(emitObj);
    return this;
  }
}
