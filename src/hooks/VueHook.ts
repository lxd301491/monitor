import { AbstractHook } from "./AbstractHook";
import { ACTION_GROUP, ACTION_LEVEL } from "../configs/globalEnum";
import { MonitorProvider } from "../MonitorProvider";
import { throws } from "assert";

export class VueHook extends AbstractHook {
  private vueConfig: any;

  initlize (options: {
    private?: MonitorProvider,
    vue?: {config: any}
  }) {
    this.private = options.private || this.private;
    this.vueConfig = options.vue ? options.vue.config : this.vueConfig;
    return this;
  }

  watch(): void {
    if (!this.private || !this.vueConfig) {
      throw Error("VueHook can not start watch, has not initlized");
    }
    this.vueConfig.errorHandler = (err: any, vm: any, info: string) => {
      let comFloor: string = "";
      if (vm) {
        let cur = vm;
        comFloor = vm.$options.name;
        while ((cur = cur.$parent)) {
          comFloor = vm.$options.name + "=>" + comFloor;
        }
      }
      this.private && this.private.track({
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
    this.vueConfig.errorHandler = undefined;
  }
}
