import { AbstractHook } from "./AbstractHook";
import { ACTION_GROUP, ACTION_LEVEL } from "../configs/globalEnum";
import { MonitorProvider } from "../MonitorProvider";

export class UncaughtHook extends AbstractHook {
  initlize (options: {
    private?: MonitorProvider
  }) {
    this.private = options.private || this.private;
    return this;
  }
  
  private listener(evt: PromiseRejectionEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.private && this.private.track({
      level: ACTION_LEVEL.ERROR,
      action: `全局未捕获异常`,
      actionGroup: ACTION_GROUP.GLOBAL_UNCAUGHT,
      jsErrorStack: evt.reason
    });
  }

  watch(): void {
    if (!this.private) {
      throw Error("UncaughtHook can not start watch, has not initlized");
    }
    window.addEventListener("unhandledrejection", this.listener.bind(this));
  }
  
  unwatch(): void {
    window.removeEventListener("unhandledrejection", this.listener.bind(this));
  }
}
