import { MonitorProvider } from "./MonitorProvider";
import { MonitorConsumer } from "./MonitorConsumer";
import { Store } from "./Store";
import { emitType } from "./typings";
import { AxiosInstance } from "axios";
import { HooksStore } from "./hooks";

export class MonitorCenter {
  private store: Store;
  private provider: MonitorProvider;
  private hooks: HooksStore;
  private consumer?: MonitorConsumer;
  
  constructor (appName: string) {
    this.store = new Store(appName);
    this.provider = new MonitorProvider(this.store);
    this.hooks = new HooksStore(this.provider);
  }

  /**
   * 注册消费者
   * @param consumer 消费者实例
   */
  subscribe(api: string, emitType?: emitType, fetch?: AxiosInstance): MonitorConsumer {
    if (!this.store) {
      throw new ReferenceError("The init method has not be invoked, please invoke it before this");
    }
    this.consumer = new MonitorConsumer(api, this.store, emitType, fetch);
    return this.consumer;
  }

  getStore() {
    return this.store;
  }

  getProvider() {
    return this.provider;
  }

  getConsumer() {
    return this.consumer;
  }

  getHooks() {
    return this.hooks;
  }
}
