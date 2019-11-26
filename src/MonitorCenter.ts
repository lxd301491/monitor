import { MonitorProvider } from "./MonitorProvider";
import { MonitorConsumer } from "./MonitorConsumer";
import { Store } from "./Store";
import { EMIT_TYPE } from "./configs/globalEnum";
import { AxiosInstance } from "axios";

export class MonitorCenter {
  private provider: MonitorProvider;
  private consumer?: MonitorConsumer;
  private store: Store;

  constructor (appName: string) {
    this.store = new Store(appName);
    this.provider = new MonitorProvider(this.store);
  }

  /**
   * 注册消费者
   * @param consumer 消费者实例
   */
  subscribe(api: string, emitType?: EMIT_TYPE, fetch?: AxiosInstance): MonitorConsumer {
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
}
