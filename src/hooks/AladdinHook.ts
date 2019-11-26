import { AbstractHook } from "./AbstractHook";
import { ACTION_GROUP, ACTION_LEVEL } from "../configs/globalEnum";
import { MonitorCenter } from "../MonitorCenter";

export class AladdinHook extends AbstractHook {
  private timers: any[] = [];
  private aladdin: any;

  constructor(center: MonitorCenter, aladdin: any) {
    super(center, "alddinAbnormal");
    this.aladdin = aladdin;
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
          this.center.getProvider().track({
            actionLevel: ACTION_LEVEL.CARSH,
            action: `${args[0].url} 20000+`,
            actionGroup: ACTION_GROUP.TIMEOUT
          });
        }, 20000)
      });
    }
  }

  private callbackListener(params: any) {
    let callId: string = params.handlerKey.split("_")[0];
    let timer: any = this.timers.filter((item: any) => {
      return item.callId === callId;
    });
    if (timer.length > 0) timer = timer[0];
    clearTimeout(timer.handler);
    let duration: number = new Date().getTime() - timer.timestamp;
    if (duration > 5000) {
      this.center.getProvider().track({
        actionLevel: ACTION_LEVEL.WARNING,
        action: `${timer.args[0].url} ${duration}`,
        actionGroup: ACTION_GROUP.PERFORMANCE
      });
    }
  }

  watch(): void {
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
