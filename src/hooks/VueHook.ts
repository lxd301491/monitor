import { AbstractHook } from "./AbstractHook";
import { MonitorProvider } from "../MonitorProvider";

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
        ...this.private.getBasicInfo(),
        msg: err.message,
        file: `${comFloor} ${info}`,
        stack: err.stack,
        line: err.line,
        col: err.colum,
        ms: "vue",
        ml: "error"
      });
    };
  }
  
  unwatch(): void {
    this.vueConfig.errorHandler = undefined;
  }
}
