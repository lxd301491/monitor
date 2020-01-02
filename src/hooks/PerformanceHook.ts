import { AbstractHook } from "./AbstractHook";
import { perforPage, on, off, getBasicInfo } from "../tools";

export class PerformanceHook extends AbstractHook {
  private listener (evt: Event) {
    setTimeout(() => {
      this.private.track({
        ...getBasicInfo(),
        ...perforPage()
      });
    }, 20);
  }
  
  watch(): void {
    on("load", this.listener.bind(this));
  }

  unwatch(): void {
    off("load", this.listener.bind(this));
  }
}
