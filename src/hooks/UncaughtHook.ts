import { AbstractHook } from "./AbstractHook";
import { on, off } from "../tools";
import { MonitorProvider } from "../MonitorProvider";


export class UncaughtHook extends AbstractHook {
  private handler: any;

  constructor (provider: MonitorProvider) {
    super(provider);
    this.handler = this.listener.bind(this);
  }

  private listener(evt: PromiseRejectionEvent) {
    evt.stopPropagation();
    evt.preventDefault();
    this.provider.track({
      msg: evt.reason,
      ms: "uncaught",
      ml: "error"
    });
  }

  watch(): void {
    on("unhandledrejection", this.handler);
  }
  
  unwatch(): void {
    off("unhandledrejection", this.handler);
  }
}
