import { AbstractHook } from "./AbstractHook";
import { MonitorProvider } from "../MonitorProvider";

export class UIEventHook extends AbstractHook {
  initlize (options: {
    private?: MonitorProvider
  }) {
    this.private = options.private || this.private;
    return this;
  }
  
  private listener(ev: UIEvent) {
    this.private && this.private.track({
      otitle: "123",
      olabel: "12333",
      opts: {
        "WT.adb": "123"
      }
    });
  }

  watch(): void {
    if (!this.private) {
      throw Error("UIEventHook can not start watch, has not initlized");
    }
    document.addEventListener("click", this.listener.bind(this));
  }

  unwatch(): void {
    document.removeEventListener("click", this.listener.bind(this));
  }
}
