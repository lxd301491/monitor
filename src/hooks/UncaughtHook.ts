import { AbstractHook } from "./AbstractHook";
import { MonitorProvider } from "../MonitorProvider";
import { on, off } from "../tools";

export class UncaughtHook extends AbstractHook {
  initlize (options: {
    private?: MonitorProvider
  }) {
    this.private = options.private || this.private;
    return this;
  }
  
  private listener(evt: PromiseRejectionEvent) {
    if (!this.private) return;
    evt.stopPropagation();
    evt.preventDefault();
    this.private.track({
      ...this.private.getBasicInfo(),
      msg: evt.reason,
      ms: "uncaught",
      ml: "error"
    });
  }

  watch(): void {
    if (!this.private) {
      throw Error("UncaughtHook can not start watch, has not initlized");
    }
    on("unhandledrejection", this.listener.bind(this));
  }
  
  unwatch(): void {
    off("unhandledrejection", this.listener.bind(this));
  }
}
