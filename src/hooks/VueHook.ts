import { AbstractHook } from "./AbstractHook";

export class VueHook extends AbstractHook {
  private vue: any;

  watch(container?: any): void {
    this.vue = container || this.vue;
    if (!this.vue) {
      throw Error("VueHook can not start watch, has not initlized");
    }
    this.vue.config.errorHandler = (err: Error, vm: any, info: string) => {
      let comFloor: string = "";
      if (vm) {
        let cur = vm;
        comFloor = vm.$options.name;
        while ((cur = cur.$parent)) {
          comFloor = vm.$options.name + "=>" + comFloor;
        }
      }
      this.provider && this.provider.track({
        msg: `${err.name} ${err.message}`,
        file: `${comFloor} ${info}`,
        stack: err.stack,
        ms: "vue",
        ml: "error"
      });
    };
  }
  
  unwatch(): void {
    delete this.vue.config.errorHandler;
  }
}
