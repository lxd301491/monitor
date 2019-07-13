import { VariableExp } from "./VariableExp";
import { MonitorCenter } from "./MonitorCenter";
import { Queue } from "../base/Queue";
import { AbstractConsumer } from "./AbstractConsumer";

export class MonitorProvider {
  /**
   * 静态数据，添加后每个生成的埋点都会携带，除非主动发生改变
   */
  private eternals: Map<string, VariableExp> = new Map<string, VariableExp>();
  private storage: any;
  private pointQueue: Queue<any>;
  private center: MonitorCenter;
  private handler: string;
  private curPoint: any;
  private curConsumerIndex: number = 0;
  private processHandler: number = 0;
  private limits: any = {
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
  } 

  constructor(
    center: MonitorCenter,
    handler: string,
    volume: number = 10,
    storage: any | undefined = undefined
  ) {
    if (
      storage &&
      typeof storage.setItem === "function" &&
      typeof storage.getItem === "function"
    ) {
      this.storage = storage;
    }
    this.center = center;
    this.pointQueue = new Queue(volume);
    this.handler = handler;
  }

  async mergeEternals(params: any, limits: any) {
    for (const key in params) {
      this.eternals.set(key, new VariableExp(params[key], limits[key] || 0));
    }
  }

  setCommonLimits(limits: any) {
    this.limits = limits;
  }

  generate(params: any, limits: any = {}) {
    let emitObj: any = {};
    this.eternals.forEach((value, key) => {
      emitObj[key] = value.toString();
    });
    for (const key in params) {
      emitObj[key] = new VariableExp(params[key], limits[key] || this.limits[key] || 0).toString();
    }
    var pointKey = `${this.handler}_${Math.random()
      .toString(32)
      .substring(2)}_${new Date().getTime()}`;
    emitObj["visitFlag"] = this.center.getVisitFlag();
    emitObj["actionStack"] = this.center.applyStack();
    this.pointQueue.push({
      key: pointKey,
      value: emitObj
    });
    if (this.storage) {
      this.storage.setItem(pointKey, JSON.stringify(emitObj));
    }
  }

  start(): void {
    this.processHandler = window.setInterval(() => {
      if (
        (this.curPoint || this.pointQueue.size() > 0) &&
        this.center.applyConcurrent()
      ) {
        this.curPoint = this.curPoint || this.pointQueue.pop();
        let consumers: AbstractConsumer[] = this.center.applyConsumers(
          this.handler
        );
        let consumer = consumers[this.curConsumerIndex];
        consumer.consume(this.curPoint);
        if (this.curConsumerIndex === consumers.length - 1) {
          this.curConsumerIndex = 0;
          this.curPoint = null;
        }
      }
    }, 20);
  }

  pause() {
    if (this.processHandler) {
      clearInterval(this.processHandler);
    }
    this.processHandler = 0;
  }
}
