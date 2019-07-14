import { MonitorProvider } from "../providers/MonitorProvider";
import { AbstractConsumer } from "../consumers/AbstractConsumer";
import { Counter } from "../tools/Counter";
import { EMIT_TYPE } from "../configs/globalEnum";
import * as hooks from "../hooks/index";
import * as consumers from "../consumers/index";

export class MonitorCenter {
  private providers: Map<string, MonitorProvider> = new Map();
  private consumers: Map<string, AbstractConsumer> = new Map();
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
    this.providers.set(handler, provider);
    provider.start();
    return provider;
  }

  subscribe(
    cunsumerType: consumers.CONSUMER_TYPE,
    handler: string,
    api: string,
    emitType: EMIT_TYPE | undefined = undefined
  ): AbstractConsumer {
    let consumer: AbstractConsumer = new (<any>consumers)[cunsumerType](
      this,
      handler,
      api,
      emitType
    );

    let parentConsumer = this.consumers.get(handler);
    while (parentConsumer && parentConsumer.hasNextConsumer()) {
      parentConsumer = parentConsumer.getNextConsumer();
    }
    if (parentConsumer) {
      parentConsumer.setNextConsumer(consumer);
    } else {
      this.consumers.set(handler, consumer);
    }
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

  applyConsumers(handler: string): AbstractConsumer | undefined {
    return this.consumers.get(handler);
  }

  launchHook(hookType: hooks.HOOK_TYPE, instanceParameters: any[]): any {
    let greeter: any = (<any>hooks)[hookType].getInstance.apply(
      (<any>hooks)[hookType],
      instanceParameters
    );
    return greeter;
  }
}
