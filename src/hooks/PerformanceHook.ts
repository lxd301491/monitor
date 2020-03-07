import { AbstractHook } from "./AbstractHook";
import { perforPage, on, off } from "../tools";
import { MonitorProvider } from "../MonitorProvider";

export class PerformanceHook extends AbstractHook {
  private handler: any;

  constructor (provider: MonitorProvider) {
    super(provider);
    this.handler = this.listener.bind(this);
  }

  private listener (evt: Event) {
    setTimeout(() => {
      this.provider.track({
        ...perforPage(),
        msg: "",
        ms: "performance",
        ml: "info"
      });
    }, 20);
  }
  
  watch(): void {
    on("load", this.handler);
  }

  unwatch(): void {
    off("load", this.handler);
  }
}
