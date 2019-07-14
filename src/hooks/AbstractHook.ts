import { MonitorCenter } from "../process/MonitorCenter";
import { MonitorProvider } from "../providers/MonitorProvider";
import { CONSUMER_TYPE } from "../consumers/index";
import { AbstractConsumer } from "../consumers/AbstractConsumer";

export abstract class AbstractHook {
  protected center: MonitorCenter;
  protected provider: MonitorProvider;
  private consumer: AbstractConsumer;

  protected constructor(center: MonitorCenter, handler: string, url: string) {
    this.center = center;
    this.provider = this.center.register(handler, 10);
    this.consumer = this.center.subscribe(
      CONSUMER_TYPE.MonitorConsumer,
      handler,
      url
    );
  }

  static getInstance<T extends AbstractHook>(
    this: new (center: MonitorCenter, url: string, other: any) => T,
    center: MonitorCenter,
    url: string,
    other: any
  ): T {
    if (!(<any>this).instance) {
      (<any>this).instance = new this(center, url, other);
    }
    return (<any>this).instance;
  }

  getProvider(): MonitorProvider {
    return this.provider;
  }

  getConsumer(): AbstractConsumer {
    return this.consumer;
  }
}
