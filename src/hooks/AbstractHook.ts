import { MonitorProvider } from "../MonitorProvider";

export abstract class AbstractHook {
  protected private?: MonitorProvider;

  abstract initlize (options: any): AbstractHook; 

  abstract watch(): void;

  abstract unwatch(): void;
}
