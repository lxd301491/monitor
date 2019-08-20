import { AbstractHook } from "./AbstractHook";
import { ACTION_GROUP, ACTION_LEVEL } from "../configs/globalEnum";
import { MonitorCenter } from "../MonitorCenter";

export class UncaughtHook extends AbstractHook {
  protected constructor(center: MonitorCenter, api: string) {
    super(center, "windowUncaught", api);
  }
  
  private listener(evt: PromiseRejectionEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.provider.track({
      level: ACTION_LEVEL.ERROR,
      action: `全局未捕获异常`,
      actionGroup: ACTION_GROUP.GLOBAL_UNCAUGHT,
      jsErrorStack: evt.reason
    });
  }

  watch(): void {
    window.addEventListener("unhandledrejection", this.listener.bind(this));
  }
  
  unwatch(): void {
    window.removeEventListener("unhandledrejection", this.listener.bind(this));
  }
}
