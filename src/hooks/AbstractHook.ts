import { MonitorCenter } from "../MonitorCenter";

export abstract class AbstractHook {
  protected center: MonitorCenter;

  constructor(center: MonitorCenter, handler: string) {
    this.center = center;
  }

  abstract watch(): void;

  abstract unwatch(): void;
}
