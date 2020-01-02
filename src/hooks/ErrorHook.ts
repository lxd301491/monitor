import { AbstractHook } from "./AbstractHook";
import { on, off, getBasicInfo } from "../tools";

export class ErrorHook extends AbstractHook {
  private listener (evt: ErrorEvent) {
    if (!this.private) {
      throw Error("GlobalErrorHook can not start watch, has not initlized");
    }
    evt.stopPropagation();
    evt.preventDefault();
    if (evt.target instanceof HTMLImageElement ||
        evt.target instanceof HTMLScriptElement ||
        evt.target instanceof HTMLLinkElement
    ) {
      let src = evt.target instanceof HTMLImageElement ||
      evt.target instanceof HTMLScriptElement ? evt.target.src :
      evt.target instanceof HTMLLinkElement ?  evt.target.href : "";
      this.private.track({
        ...getBasicInfo(),
        msg: evt.target.outerHTML,
        file: src,
        stack: evt.target.localName.toUpperCase(),
        line: 0,
        col: 0,
        ms: "error",
        ml: "error"
      });
    } else {
      let stack: string = "";
      if (!!evt.error && !!evt.error.stack) {
        // 如果浏览器有堆栈信息 直接使用
        stack = evt.error.stack.toString();
      } else if (arguments) {
        // 尝试通过callee拿堆栈信息
        let ext: string[] = [];
        // eslint-disable-next-line no-caller
        let f: Function = arguments.callee.caller;
        let c: number = 3;
        // 这里只拿三层堆栈信息
        while (f && --c > 0) {
          ext.push(f.toString());
          if (f === f.caller) {
            break; // 如果有环
          }
          f = f.caller;
        }
        stack = ext.join(",");
      }
      this.private.track({
        ...getBasicInfo(),
        file: evt.filename,
        line: evt.lineno,
        col: evt.colno,
        stack: stack,
        msg: evt.message,
        ms: "error",
        ml: "error"
      });
    }
  }

  watch(): void {
    on("error", this.listener.bind(this));
  }
  unwatch(): void {
    off("error", this.listener.bind(this));
  }
}
