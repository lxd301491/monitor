import { AbstractHook } from "./AbstractHook";
import { on, off, getBasicInfo } from "../tools";

export class UncaughtHook extends AbstractHook {
  private listener(evt: PromiseRejectionEvent) {
    evt.stopPropagation();
    evt.preventDefault();
    this.provider.track({
      ...getBasicInfo(),
      msg: evt.reason,
      ms: "uncaught",
      ml: "error"
    });
  }

  watch(container?: any): void {
    on("unhandledrejection", this.listener.bind(this));
  }
  
  unwatch(): void {
    off("unhandledrejection", this.listener.bind(this));
  }
}
