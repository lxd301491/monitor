import { MonitorCenter } from "../process/MonitorCenter";
import { MonitorProvider } from "../providers/MonitorProvider";
import { MonitorConsumer } from "../consumers/MonitorConsumer";

export class AbstractHook {
  protected center: MonitorCenter;
  protected provider: MonitorProvider;
  private consumer: MonitorConsumer;

  constructor(center: MonitorCenter, handler: string, url: string) {
    this.center = center;
    this.provider = new MonitorProvider(this.center, handler, 10);
    this.consumer = new MonitorConsumer(this.center, handler, url);
  }

  getProvider(): MonitorProvider {
    return this.provider;
  }

  getConsumer(): MonitorConsumer {
    return this.consumer;
  }
}
