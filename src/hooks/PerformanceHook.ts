import { AbstractHook } from "./AbstractHook";
import { perforPage, on, off, getBasicInfo } from "../tools";

export class PerformanceHook extends AbstractHook {
  private listener (evt: Event) {
    setTimeout(() => {
      this.provider.track({
        ...getBasicInfo(),
        ...perforPage(),
        ms: "performance",
        ml: "info"
      });
    }, 20);
  }
  
  watch(container?: any): void {
    on("load", this.listener.bind(this));
  }

  unwatch(): void {
    off("load", this.listener.bind(this));
  }
}
