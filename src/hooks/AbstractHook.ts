import { MonitorCenter } from "../MonitorCenter";
import { MonitorProvider } from "../MonitorProvider";
import { MonitorConsumer } from "../MonitorConsumer";

export abstract class AbstractHook {
  protected center: MonitorCenter;
  protected provider: MonitorProvider;
  private consumer: MonitorConsumer;

  protected constructor(center: MonitorCenter, handler: string, api: string) {
    this.center = center;
    this.provider = this.center.register(new MonitorProvider(handler));
    this.consumer = this.center.subscribe(new MonitorConsumer(handler, api));
    this.consumer.start();
  }

  static getInstance<T extends AbstractHook>(
    this: new (center: MonitorCenter, api: string, other: any) => T,
    center: MonitorCenter,
    api: string,
    other: any
  ): T {
    if (!(<any>this).instance) {
      (<any>this).instance = new this(center, api, other);
    }
    return (<any>this).instance;
  }

  getProvider(): MonitorProvider {
    return this.provider;
  }

  getConsumer(): MonitorConsumer {
    return this.consumer;
  }
}
