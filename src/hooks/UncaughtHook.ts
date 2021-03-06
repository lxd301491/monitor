import { AbstractHook } from "./AbstractHook";
import { on, off } from "../tools";

export class UncaughtHook extends AbstractHook {
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
    on("unhandledrejection", this.listener.bind(this));
  }
  
  unwatch(): void {
    off("unhandledrejection", this.listener.bind(this));
  }
}
