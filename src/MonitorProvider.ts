import { VariableExp } from "./VariableExp";
import { StoreArea } from "./storeArea";

const limits: any = {
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
  private handler: string = "";
  private store: StoreArea | undefined;
  private limits: any = limits;

  constructor(handler: string) {  
    this.handler = handler;
  }

  mountStore(store: StoreArea) {
    this.store = store;
  } 

  mergeEternals(params: any, limits: any): void {
    for (const key in params) {
      this.eternals.set(key, new VariableExp(params[key], limits[key] || 0));
    }
  }

  setCommonLimits(limits: any) {
    this.limits = limits;
  }

  async track(params: any, limits: any = {}) {
    let emitObj: any = {};
    this.eternals.forEach(async (value, key) => {
      emitObj[key] = await value.toString();
    });
    for (const key in params) {
      emitObj[key] = await new VariableExp(
        params[key],
        limits[key] || this.limits[key] || 0
      ).toString();
    }
    if (this.store) this.store.store(this.handler, emitObj);
  }
}
