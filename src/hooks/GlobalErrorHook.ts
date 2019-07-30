import { AbstractHook } from "./AbstractHook";
import { MonitorCenter } from "../MonitorCenter";
import { ACTION_LEVEL, ACTION_GROUP } from "../configs/globalEnum";

export class GlobalErrorHook extends AbstractHook {
  constructor(center: MonitorCenter, api: string) {
    super(center, "windowError", api);
    let self = this;
    window.addEventListener("error", function(ev: ErrorEvent) {
      if (
        ev.target instanceof HTMLElement &&
        ["img", "script", "link"].includes(
          ev.target.tagName.toLocaleLowerCase()
        )
      ) {
        self.provider.track({
          actionLevel: ACTION_LEVEL.ERROR,
          action: `资源加载异常 ${ev.target.getAttribute("src")}`,
          actionGroup: ACTION_GROUP.GLOBAL_ERROR
        });
      } else {
        let stack: string = "";
        if (!!ev.error && !!ev.error.stack) {
          // 如果浏览器有堆栈信息 直接使用
          stack = ev.error.stack.toString();
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
        self.provider.track({
          actionLevel: ACTION_LEVEL.ERROR,
          action: `js全局异常`,
          actionGroup: ACTION_GROUP.GLOBAL_ERROR,
          jsErrorLineNo: ev.lineno,
          jsErrorColumnNo: ev.colno,
          jsErrorMessage: ev.message,
          jsErrorFilename: ev.filename,
          jsErrorStack: stack
        });
      }
    });
  }
}
