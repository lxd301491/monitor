import { MonitorProvider } from "./MonitorProvider";
import { MonitorConsumer } from "./MonitorConsumer";
import { StoreArea } from "./storeArea";
import * as hooks from "./hooks/index";


export class MonitorCenter {
  private providers: Array<MonitorProvider> = [];
  private consumers: Array<MonitorConsumer> = [];
  private store: StoreArea;

  constructor(appName: string) {
    this.store = new StoreArea(appName);
  }

  getStoreIns() {
    return this.store;
  }

  register(provider: MonitorProvider): MonitorProvider {
    this.providers.push(provider);
    return provider;
  }

  subscribe(consumer: MonitorConsumer): MonitorConsumer {
    this.consumers.push(consumer);
    return consumer;
  }

  launchHook(hookType: hooks.HOOK_TYPE, instanceParameters: any[]): any {
    let greeter: any = (<any>hooks)[hookType].getInstance.apply(
      (<any>hooks)[hookType],
      instanceParameters
    );
    return greeter;
  }
}
