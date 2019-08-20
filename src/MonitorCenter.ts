import { MonitorProvider } from "./MonitorProvider";
import { MonitorConsumer } from "./MonitorConsumer";
import { StoreArea } from "./storeArea";

export interface LifeCycle {
  beforeTrack?: Function | undefined;
  afterTrack?: Function | undefined;
  beforeConsume?: Function | undefined;
  afterConsume?: Function | undefined;
}

export class MonitorCenter {
  private providers: Array<MonitorProvider> = [];
  private consumers: Array<MonitorConsumer> = [];
  private store?: StoreArea;
  private lifeCycle?: LifeCycle;
  private static _instance: MonitorCenter;


  static getInstance(): MonitorCenter{
    if (this._instance == null) {
      this._instance = new MonitorCenter();
    }
    return this._instance;
  }

  init (appName: string, lifeCycle?: LifeCycle) {
    this.store = new StoreArea(appName);
    this.lifeCycle = lifeCycle ? lifeCycle : {};
  }

  getLifeCycle (): LifeCycle | undefined {
    return this.lifeCycle;
  }

  getStoreInstance() {
    return this.store;
  }

  register(provider: MonitorProvider): MonitorProvider {
    if (this.store) {
      provider.mountStore(this.store);
      this.providers.push(provider);
    }
    return provider;
  }

  subscribe(consumer: MonitorConsumer): MonitorConsumer {
    if (this.store) {
      consumer.mountStore(this.store);
      this.consumers.push(consumer);
    }
    return consumer;
  }
}
