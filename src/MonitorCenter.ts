import { MonitorProvider } from "./MonitorProvider";
import { MonitorConsumer } from "./MonitorConsumer";
import { Store } from "./Store";
import { EmitType, InfoType, Infos, IConsumer } from "./typings";
import { HooksStore } from "./hooks";
import { pv, randomString } from "./tools";
import { globalConfig } from "./configs";

export class MonitorCenter {
  private store: Store;
  private provider: MonitorProvider;
  private hooks: HooksStore;
  private consumers: Map<String, IConsumer> = new Map();
  private timer?: number;
  
  constructor (appName: string, debug?: boolean) {
    globalConfig.debug = debug || false;
    this.store = new Store(appName);
    this.provider = new MonitorProvider(this.store);
    this.hooks = new HooksStore(this.provider);
    pv(this.provider);
  }

  start(options: {
    period?: number,
    size?: number, 
    zip?: boolean
  }) {
    if (this.timer) clearInterval(this.timer);
    this.timer = window.setInterval(async () => {
      let data = await this.store.shiftMore(options.size);
      if (data) {
        this.consumers.forEach((consumer, key) => {
          consumer.consume(data, options.zip);
        })
      }
    }, options.period || 15000);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  /**
   * 注册自定义消费者
   * @param consumer 消费者实例
   */
  subscribeCustom<T extends IConsumer>(consumer: T): string {
    if (!this.store) {
      throw new ReferenceError("The init method has not be invoked, please invoke it before this");
    }
    let key: string = randomString(10);
    this.consumers.set(key, consumer);
    return key;
  }

  /**
   * 注册消费者
   * @param consumer 消费者实例
   */
  subscribe(api: string, emitType?: EmitType): string {
    if (!this.store) {
      throw new ReferenceError("The init method has not be invoked, please invoke it before this");
    }
    let key: string = randomString(10);
    this.consumers.set(key, new MonitorConsumer(api, emitType));
    return key;
  }


  unsubscribe(key: string) {
    this.consumers.delete(key);
  }

  getStore() {
    return this.store;
  }

  track (params: Infos) {
    this.provider.track(params);
  }

  public watch(type: InfoType, container?: any){
    this.hooks.watch(type, container);
  }

  public unwatch(type: InfoType) {
    this.hooks.unwatch(type);
  }
}
