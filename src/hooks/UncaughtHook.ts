import { AbstractHook } from "./AbstractHook";
import { on, off, getBasicInfo } from "../tools";

export class UncaughtHook extends AbstractHook {
  private listener(evt: PromiseRejectionEvent) {
    if (!this.private) return;
    evt.stopPropagation();
    evt.preventDefault();
    this.private.track({
      ...getBasicInfo(),
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
