import { MonitorProvider } from "../MonitorProvider";

export abstract class AbstractHook {
  protected private: MonitorProvider;

  constructor (_private: MonitorProvider) {
    this.private = _private;
  }
  
  abstract watch(): void;

  abstract unwatch(): void;
}
