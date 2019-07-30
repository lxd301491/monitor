import { AbstractHook } from "./AbstractHook";
import { ACTION_GROUP, ACTION_LEVEL } from "../configs/globalEnum";
import { MonitorCenter } from "../MonitorCenter";

export class UncaughtHook extends AbstractHook {
  constructor(center: MonitorCenter, api: string) {
    super(center, "windowUncaught", api);
    let self = this;
    window.addEventListener("unhandledrejection", function(
      ev: PromiseRejectionEvent
    ) {
      self.provider.track({
        level: ACTION_LEVEL.ERROR,
        action: `全局未捕获异常`,
        actionGroup: ACTION_GROUP.GLOBAL_UNCAUGHT,
        jsErrorStack: ev.reason
      });
    });
  }
}
