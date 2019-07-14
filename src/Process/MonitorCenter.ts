import { MonitorProvider } from "../providers/MonitorProvider";
import { AbstractConsumer } from "../consumers/AbstractConsumer";
import { Counter } from "../tools/Counter";
import { EMIT_TYPE, CONSUMER_TYPE } from "../configs/globalEnum";
import { MonitorConsumer } from "../consumers/MonitorConsumer";
import { WebtrendsConsumer } from "../consumers/WebtrendsConsumer";

export class MonitorCenter {
  private providers: MonitorProvider[] = [];
  private consumers: AbstractConsumer[] = [];
  private maxConcurrent: number = 5;
  private concurrentCounter: Counter = new Counter();
  private visitFlag: string = `${Math.random()
    .toString(32)
    .substring(2)}${new Date().getTime()}`;
  private stack: number = 0;

  constructor(concurrent: number) {
    this.maxConcurrent = concurrent;
  }

  getVisitFlag(): string {
    return this.visitFlag;
  }

  applyStack() {
    return ++this.stack;
  }

  register(
    handler: string,
    volume: number | undefined = undefined,
    storage: any | undefined = undefined
  ): MonitorProvider {
    let provider = new MonitorProvider(this, handler, volume, storage);
    this.providers.push(provider);
    provider.start();
    return provider;
  }

  subscribe(
    cunsumerType: CONSUMER_TYPE,
    handler: string,
    url: string,
    emitType: EMIT_TYPE | undefined = undefined
  ): AbstractConsumer {
    let consumer: AbstractConsumer;
    switch (cunsumerType) {
      case CONSUMER_TYPE.DEAFULT:
        consumer = new MonitorConsumer(this, handler, url, emitType);
        break;
      case CONSUMER_TYPE.WEBTRENDS:
        consumer = new WebtrendsConsumer(this, handler);
        break;
      default:
        consumer = new MonitorConsumer(this, handler, url, emitType);
    }
    this.consumers.push(consumer);
    return consumer;
  }

  applyConcurrent(): number {
    if (this.concurrentCounter.get() < this.maxConcurrent) {
      this.concurrentCounter.increase();
      return this.concurrentCounter.get();
    }
    return -1;
  }

  remandConcurrent(): void {
    this.concurrentCounter.decrease();
  }

  applyConsumers(handler: string): AbstractConsumer[] {
    return this.consumers.filter(item => {
      return item.checkHandler(handler);
    });
  }
}
