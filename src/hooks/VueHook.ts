import { AbstractHook } from "./AbstractHook";
import { ACTION_GROUP, ACTION_LEVEL } from "../configs/globalEnum";
import { MonitorCenter } from "../process/MonitorCenter";

export class VueHook extends AbstractHook {
  constructor(center: MonitorCenter, url: string, Vue: any) {
    super(center, "vueError", url);
    Vue.config.errorHandler = (err: any, vm: any, info: string) => {
      let comFloor: string = "";
      if (vm) {
        let cur = vm;
        comFloor = vm.$options.name;
        while ((cur = cur.$parent)) {
          comFloor = vm.$options.name + "=>" + comFloor;
        }
      }
      this.provider.generate({
        actionLevel: ACTION_LEVEL.ERROR,
        action: `${comFloor} ${info}`,
        actionGroup: ACTION_GROUP.TIMEOUT,
        jsErrorMessage: err.message,
        jsErrorLineNo: err.line,
        jsErrorColumnNo: err.colum,
        jsErrorStack: err.stack
      });
    };
  }
}
