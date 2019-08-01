import { MonitorProvider } from "./MonitorProvider";
import { MonitorConsumer } from "./MonitorConsumer";
import { StoreArea } from "./storeArea";

export class MonitorCenter {
  private providers: Array<MonitorProvider> = [];
  private consumers: Array<MonitorConsumer> = [];
  private store: StoreArea;

  constructor(appName: string) {
    this.store = new StoreArea(appName);
  }

  getStoreInstance() {
    return this.store;
  }

  register(provider: MonitorProvider): MonitorProvider {
    provider.mountStore(this.store);
    this.providers.push(provider);
    return provider;
  }

  subscribe(consumer: MonitorConsumer): MonitorConsumer {
    consumer.mountStore(this.store);
    this.consumers.push(consumer);
    return consumer;
  }
}
