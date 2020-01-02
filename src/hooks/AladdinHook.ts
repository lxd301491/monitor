import { AbstractHook } from "./AbstractHook";
import { getBasicInfo } from "../tools";
export class AladdinHook extends AbstractHook {
  private timers: any[] = [];
  private aladdin: any;

  initlize (options: {
    aladdin?: {on: Function, off: Function}
  }) {
    this.aladdin = options.aladdin || this.aladdin;
    return this;
  }

  private callListener(params: any) {
    let { action, args, callId } = params;
    if (
      args.filter((item: any) => {
        return typeof item === "function";
      }).length > 0 && !['getLocation', 'setWatermark'].includes(action)
    ) {
      this.timers.push({
        callId: callId,
        args: args,
        timestamp: new Date().getTime(),
        handler: setTimeout(() => {
          if (!this.private) return;
          this.private.track({
            ...getBasicInfo(),
            msg: `${args[0].url} timeout 20000+`,
            ms: "native",
            ml: "crash"
          });
        }, 20000)
      });
    }
  }

  private callbackListener(params: any) {
    if (!this.private) {
      throw Error("AladdinHook callbackListener private has not initlized");
    }
    let callId: string = params.handlerKey.split("_")[0];
    let timer: any = this.timers.filter((item: any) => {
      return item.callId === callId;
    });
    if (timer.length > 0) timer = timer[0];
    clearTimeout(timer.handler);
    let duration: number = new Date().getTime() - timer.timestamp;
    if (duration > 5000) {
      this.private.track({
        ...getBasicInfo(),
        msg: `${timer.args[0].url} timeout ${duration}`,
        ms: "native",
        ml: "warning"
      });
    }
  }

  watch(): void {
    if (!this.aladdin) {
      throw Error("AladdinHook can not start watch, has not initlized");
    }
    this.aladdin.on("call", this.callListener.bind(this));
    this.aladdin.on("callback", this.callbackListener.bind(this));
    if (process.env.NODE_ENV === 'development') {
      this.aladdin.on("error", (error: any) => {
        console.log('aladdin event meet error:', JSON.stringify(error));
      });
    }
  }

  unwatch(): void {
    this.aladdin.off("call", this.callListener);
    this.aladdin.off("callback", this.callbackListener);
    this.timers.forEach(timer => {
      clearTimeout(timer.handler);
    });
    this.timers = [];
  }
}
