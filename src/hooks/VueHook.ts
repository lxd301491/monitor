import { AbstractHook } from "./AbstractHook";
import { ACTION_GROUP, ACTION_LEVEL } from "../configs/globalEnum";
import { MonitorCenter } from "../MonitorCenter";

export class VueHook extends AbstractHook {
  private _vue: any;

  protected constructor(center: MonitorCenter, Vue: any) {
    super(center, "vueError");
    this._vue = Vue.config;
  }

  watch(): void {
    this._vue.errorHandler = (err: any, vm: any, info: string) => {
      let comFloor: string = "";
      if (vm) {
        let cur = vm;
        comFloor = vm.$options.name;
        while ((cur = cur.$parent)) {
          comFloor = vm.$options.name + "=>" + comFloor;
        }
      }
      this.center.getProvider().track({
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
  
  unwatch(): void {
    this._vue.errorHandler = undefined;
  }
}
