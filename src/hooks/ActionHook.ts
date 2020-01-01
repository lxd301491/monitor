import { AbstractHook } from "./AbstractHook";
import { MonitorProvider } from "../MonitorProvider";
import { on, off } from "../tools";
import { actions } from "../typings";
export class ActionHook extends AbstractHook {
  initlize (options: {
    private?: MonitorProvider
  }) {
    this.private = options.private || this.private;
    return this;
  }
  
  private listener(evt: UIEvent) {
    if (!this.private) return;
    console.log(evt);
    if (evt instanceof MouseEvent) {
        this.private.track({
          ...this.private.getBasicInfo(),
          msg: evt.target instanceof HTMLElement ? evt.target.innerText : "",
          ms: "action",
          ml: "info",
          at: evt.type,
          el: evt.target instanceof HTMLElement ? evt.target.innerText : undefined,
          x: evt.x,
          y: evt.y
        });
    } else if (evt instanceof FocusEvent) {
      this.private.track({
        ...this.private.getBasicInfo(),
        msg: evt.target instanceof HTMLElement ? evt.target.innerText : "",
        ms: "action",
        ml: "info",
        at: evt.type,
        el: evt.target instanceof HTMLElement ? evt.target.innerText : undefined,
      });
    } else if (evt instanceof KeyboardEvent) {
      this.private.track({
        ...this.private.getBasicInfo(),
        msg: `${evt.type} ${evt.key}`,
        ms: "action",
        ml: "info",
        at: evt.type,
        key: evt.key
      });
    }
  }

  watch(): void {
    if (!this.private) {
      throw Error("UIEventHook can not start watch, has not initlized");
    }
    for (let action of actions) {
      on(action, this.listener.bind(this));
    }
  }

  unwatch(): void {
    for (let action of actions) {
      off(action, this.listener.bind(this));
    }
  }
}
