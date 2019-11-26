import { AbstractHook } from "./AbstractHook";
import { MonitorCenter } from "../MonitorCenter";

export class UIEventHook extends AbstractHook {
  protected constructor(center: MonitorCenter) {
    super(center, "uiEvent");
  }

  private listener(ev: UIEvent) {
    this.center.getProvider().track({
      otitle: "123",
      olabel: "12333",
      opts: {
        "WT.adb": "123"
      }
    });
  }

  watch(): void {
    document.addEventListener("click", this.listener.bind(this));
  }

  unwatch(): void {
    document.removeEventListener("click", this.listener.bind(this));
  }
}
