import { AbstractHook } from "./AbstractHook";
import Vue from "vue";
import { getBasicInfo } from "../tools";

export class VueHook extends AbstractHook {
  watch(): void {
    Vue.config.errorHandler = (err: Error, vm: any, info: string) => {
      let comFloor: string = "";
      if (vm) {
        let cur = vm;
        comFloor = vm.$options.name;
        while ((cur = cur.$parent)) {
          comFloor = vm.$options.name + "=>" + comFloor;
        }
      }
      this.provider && this.provider.track({
        ...getBasicInfo(),
        msg: `${err.name} ${err.message}`,
        file: `${comFloor} ${info}`,
        stack: err.stack,
        ms: "vue",
        ml: "error"
      });
    };
  }
  
  unwatch(): void {
    Vue.config.errorHandler =  (err: any, vm: any, info: string) => {};
  }
}
