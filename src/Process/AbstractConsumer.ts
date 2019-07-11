import { MonitorProvider } from "./MonitorProvider";

export class AbstractConsumer {
  handler: string = "";

  checkHandler(handler: string): boolean {
    return this.handler === handler;
  }

  notify(params: object) {}
}
