import { MonitorCenter } from "../process/MonitorCenter";

export abstract class AbstractConsumer {
  private handler: string;
  protected center: MonitorCenter;
  protected emitFunc: Function | undefined;
  protected nextConsumer: AbstractConsumer | undefined;

  constructor(center: MonitorCenter, handler: string) {
    this.center = center;
    this.handler = handler;
  }

  checkHandler(handler: string): boolean {
    return this.handler === handler;
  }

  async consume(params: any): Promise<any> {
    console.group("[AbstractConsumer::consume]");
    console.table(params);
    console.groupEnd();
    if (this.nextConsumer) {
      this.nextConsumer.consume(params);
    } else {
      this.center.remandConcurrent();
    }
  }

  injectCoustumEmit(func: Function) {
    this.emitFunc = func;
  }

  hasNextConsumer(): boolean {
    return !!this.nextConsumer;
  }

  setNextConsumer(consumer: AbstractConsumer): void {
    this.nextConsumer = consumer;
  }

  getNextConsumer(): AbstractConsumer | undefined {
    return this.nextConsumer;
  }
}
