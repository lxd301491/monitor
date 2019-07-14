import { MonitorCenter } from "../process/MonitorCenter";

export abstract class AbstractConsumer {
  private handler: string;
  protected center: MonitorCenter;
  protected emitFunc: Function | undefined;

  constructor(center: MonitorCenter, handler: string) {
    this.center = center;
    this.handler = handler;
  }

  checkHandler(handler: string): boolean {
    return this.handler === handler;
  }

  consume(params: any): void {}

  injectCoustumEmit(func: Function) {
    this.emitFunc = func;
  }
}
