import { AbstractHook } from "./AbstractHook";
import { on, off, getBasicInfo } from "../tools";
import { actions } from "../typings";
export class ActionHook extends AbstractHook {
  private getCurrentElement(target: HTMLElement) {
    let r = target.outerHTML.match("<.+?>");
    return r && r[0] || "";
  }
  
  private listener(evt: UIEvent) {
    if (!this.private) return;
    if (evt instanceof MouseEvent) {
        this.private.track({
          ...getBasicInfo(),
          msg: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : "",
          ms: "action",
          ml: "info",
          at: evt.type,
          el: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : undefined,
          x: evt.x,
          y: evt.y
        });
    } else if (evt instanceof FocusEvent) {
      this.private.track({
        ...getBasicInfo(),
        msg: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : "",
        ms: "action",
        ml: "info",
        at: evt.type,
        el: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : undefined,
      });
    } else if (evt instanceof KeyboardEvent) {
      this.private.track({
        ...getBasicInfo(),
        msg: `${evt.type} ${evt.key}`,
        ms: "action",
        ml: "info",
        at: evt.type,
        key: evt.key
      });
    } else if (evt instanceof InputEvent) {
      this.private.track({
        ...getBasicInfo(),
        msg: `${evt.inputType} ${evt.data}`,
        ms: "action",
        ml: "info",
        at: evt.type,
        key: evt.data || ""
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
