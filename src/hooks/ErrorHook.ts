import { AbstractHook } from "./AbstractHook";
import { on, off } from "../tools";
import { replace, reduction } from "../decorators/LifeCycle";
import { MonitorProvider } from "../MonitorProvider";

export class ErrorHook extends AbstractHook {
  private handler: any;

  constructor (provider: MonitorProvider) {
    super(provider);
    this.handler = this.listener.bind(this);
  }

  private onError(event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error): any {
    setTimeout(function(){
      let stack: string;
      //不一定所有浏览器都支持col参数
      if (!!error && !!error.stack){
          //如果浏览器有堆栈信息
          //直接使用
          stack = error.stack.toString();
      }else if (!!arguments.callee){
          //尝试通过callee拿堆栈信息
          var ext = [];
          var f = arguments.callee.caller, c = 3;
          //这里只拿三层堆栈信息
          while (f && (--c>0)) {
             ext.push(f.toString());
             if (f  === f.caller) {
                  break;//如果有环
             }
             f = f.caller;
          }
          stack = ext.join(",");
      }
      if (event || error) {
        //把data上报到后台！
        this.provider.track({
          file: source,
          line: lineno,
          col: colno,
          stack: stack,
          msg: error.message,
          ms: "error",
          ml: "error"
        });
      }
    },0);

    return true;
  }

  private listener (evt: ErrorEvent) {
    evt.stopPropagation();
    evt.preventDefault();
    if (evt.target instanceof HTMLImageElement ||
        evt.target instanceof HTMLScriptElement ||
        evt.target instanceof HTMLLinkElement
    ) {
      let src = evt.target instanceof HTMLImageElement ||
      evt.target instanceof HTMLScriptElement ? evt.target.src :
      evt.target instanceof HTMLLinkElement ?  evt.target.href : "";
      this.provider.track({
        msg: evt.target.outerHTML,
        file: src,
        stack: evt.target.localName.toUpperCase(),
        line: 0,
        col: 0,
        ms: "error",
        ml: "error"
      });
    }
  }

  watch(): void {
    replace(window, "onerror", this.onError);
    on("error", this.handler);
  }
  unwatch(): void {
    reduction(window, "onerror");
    off("error", this.handler);
  }
}
