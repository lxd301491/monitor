import { AbstractHook } from "./AbstractHook";
import { ACTION_GROUP, ACTION_LEVEL } from "../configs/globalEnum";
import { MonitorCenter } from "../process/MonitorCenter";

export class AladdinHook extends AbstractHook {
  private timers: any[] = [];

  constructor(center: MonitorCenter, url: string, aladdin: any) {
    super(center, "alddinAbnormal", url);

    aladdin.on("call", (params: any) => {
      let { args, callId } = params;
      if (
        args.filter((item: any) => {
          return typeof item === "function";
        }).length > 0
      ) {
        this.timers.push({
          callId: callId,
          args: args,
          timestamp: new Date().getTime(),
          handler: setTimeout(() => {
            this.provider.generate({
              actionLevel: ACTION_LEVEL.WARNING,
              action: `${args[0].url} 20000+`,
              actionGroup: ACTION_GROUP.TIMEOUT
            });
          }, 20000)
        });
      }
    });

    aladdin.on("callback", (params: any) => {
      let callId: string = params.handlerKey.split("_")[0];
      let timer: any = this.timers.filter((item: any) => {
        return item.callId === callId;
      });
      if (timer.length > 0) timer = timer[0];
      clearTimeout(timer.handler);
      let duration: number = new Date().getTime() - timer.timestamp;
      if (duration > 5000) {
        this.provider.generate({
          actionLevel: ACTION_LEVEL.WARNING,
          action: `${timer.args[0].url} ${duration}`,
          actionGroup: ACTION_GROUP.PERFORMANCE
        });
      }
    });
  }
}
