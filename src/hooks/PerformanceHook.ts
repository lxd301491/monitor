import { AbstractHook } from "./AbstractHook";
import { perforPage, on, off,  } from "../tools";

export class PerformanceHook extends AbstractHook {
  private listener (evt: Event) {
    setTimeout(() => {
      this.provider.track({
        ...perforPage(),
        msg: "",
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
