import { MonitorCenter } from "./MonitorCenter";

export class AbstractConsumer {
  private handler: string;
  protected center: MonitorCenter;

  constructor(center: MonitorCenter, handler: string) {
    this.center = center;
    this.handler = handler;
  }

  checkHandler(handler: string): boolean {
    return this.handler === handler;
  }

  consume(params: any): void {}
}
