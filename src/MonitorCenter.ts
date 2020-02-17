import { MonitorProvider } from "./MonitorProvider";
import { MonitorConsumer, FetchInstance } from "./MonitorConsumer";
import { Store } from "./Store";
import { EmitType } from "./typings";
import { pv } from "./tools";
import { HooksFactory } from "./hooks";

export class MonitorCenter {
  private store: Store;
  private provider: MonitorProvider;
  private consumers: MonitorConsumer[] = [];
  public readonly hooks: HooksFactory;
  private timer?: number;
  
  constructor (appName: string) {
    this.store = new Store(appName);
    this.provider = new MonitorProvider(this.store);
    this.hooks = new HooksFactory().initlize(this.provider);
    pv(this.provider);
  }

  start(period: number = 15000, size?: number) {
    if (this.timer) clearInterval(this.timer);
    this.timer = window.setInterval(async () => {
      let data = await this.store.shiftMore(size);
      this.consumers.forEach(consumer => {
        consumer.consume(data);
      })
    }, period);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = undefined;
  }
  /**
   * 注册消费者
   * @param consumer 消费者实例
   */
  subscribe(api: string, emitType?: EmitType, fetch?: FetchInstance, zip?: boolean): MonitorConsumer {
    if (!this.store) {
      throw new ReferenceError("The init method has not be invoked, please invoke it before this");
    }
    this.consumers.push(new MonitorConsumer(api, this.store, emitType, fetch, zip));
    return this.consumers[this.consumers.length - 1];
  }

  getStore() {
    return this.store;
  }

  getProvider() {
    return this.provider;
  }
}
