import { MonitorProvider } from "./MonitorProvider";
import { MonitorConsumer, FetchInstance } from "./MonitorConsumer";
import { Store } from "./Store";
import { EmitType, InfoType } from "./typings";
import { HooksStore } from "./hooks";
import { pv } from "./tools";

export class MonitorCenter {
  private store: Store;
  private provider: MonitorProvider;
  private hooks: HooksStore;
  private consumer?: MonitorConsumer;
  
  constructor (appName: string) {
    this.store = new Store(appName);
    this.provider = new MonitorProvider(this.store);
    this.hooks = new HooksStore(this.provider);
    pv(this.provider);
  }

  /**
   * 注册消费者
   * @param consumer 消费者实例
   */
  subscribe(api: string, emitType?: EmitType, fetch?: FetchInstance): MonitorConsumer {
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

  public watch(type: InfoType, container?: any) {
    let hook = this.hooks.getHooks().get(type);
    if (hook) hook.watch(container);
  }

  public unwatch(type: InfoType) {
    let hook = this.hooks.getHooks().get(type);
    if (hook) {
      hook.unwatch();
    } 
  }
}
