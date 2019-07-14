import { AbstractHook } from "./AbstractHook";
import { MonitorCenter } from "../process/MonitorCenter";

export class UIEventHook extends AbstractHook {
  constructor(center: MonitorCenter, api: string) {
    super(center, "uiEvent", api);
    let self = this;
    document.addEventListener("click", function(ev: UIEvent) {
      self.provider.generate({
        otitle: "123",
        olabel: "12333",
        opts: {
          "WT.adb": "123"
        }
      });
    });
  }
}
