import { AbstractHook } from "./AbstractHook";
import { ACTION_LEVEL, ACTION_GROUP } from "../configs/globalEnum";
import { MonitorProvider } from "../MonitorProvider";

export class GlobalErrorHook extends AbstractHook {
  initlize (options: {
    private?: MonitorProvider
  }) {
    this.private = options.private || this.private;
    return this;
  }

  private listener (evt: ErrorEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    if (
      evt.target instanceof HTMLElement &&
      ["img", "script", "link"].includes(
        evt.target.tagName.toLocaleLowerCase()
      )
    ) {
      this.private && this.private.track({
        actionLevel: ACTION_LEVEL.ERROR,
        action: `资源加载异常 ${evt.target.getAttribute("src")}`,
        actionGroup: ACTION_GROUP.GLOBAL_ERROR
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
      this.private && this.private.track({
        actionLevel: ACTION_LEVEL.ERROR,
        action: `js全局异常`,
        actionGroup: ACTION_GROUP.GLOBAL_ERROR,
        jsErrorLineNo: evt.lineno,
        jsErrorColumnNo: evt.colno,
        jsErrorMessage: evt.message,
        jsErrorFilename: evt.filename,
        jsErrorStack: stack
      });
    }
    return true;
  }

  watch(): void {
    if (!this.private) {
      throw Error("GlobalErrorHook can not start watch, has not initlized");
    }
    window.addEventListener("error", this.listener.bind(this));
  }
  unwatch(): void {
    window.removeEventListener("error", this.listener.bind(this));
  }
}
