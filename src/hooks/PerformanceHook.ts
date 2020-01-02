import { AbstractHook } from "./AbstractHook";
import { perforPage, on, off, getBasicInfo } from "../tools";

export class PerformanceHook extends AbstractHook {
  private listener (evt: Event) {
    if (!this.private) {
      throw Error("UIEventHook can not start watch, has not initlized");
    }
    this.private.track({
      ...getBasicInfo(),
      ...perforPage()
    })
  }

  watch(): void {
    on("load", this.listener);
  }

  unwatch(): void {
    off("load", this.listener);
  }

 
}
