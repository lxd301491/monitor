import { MonitorProvider } from "../MonitorProvider";

export abstract class AbstractHook {
  protected provider: MonitorProvider;

  constructor (provider: MonitorProvider) {
    this.provider = provider;
  }
  
  abstract watch(...any: any): void;

  abstract unwatch(...any: any): void;
}
