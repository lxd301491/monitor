import { MonitorProvider } from "./MonitorProvider";
import { AbstractConsumer } from "./AbstractConsumer";
import { Counter } from "../circuitBreaker/Counter";

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

  register(provider: MonitorProvider): MonitorProvider {
    this.providers.push(provider);
    provider.start();
    return provider;
  }

  subscribe(consumer: AbstractConsumer): AbstractConsumer {
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
