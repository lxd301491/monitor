import { AladdinHook } from "./AladdinHook";
import { GlobalErrorHook } from "./GlobalErrorHook";
import { UIEventHook } from "./UIEventHook";
import { UncaughtHook } from "./UncaughtHook";
import { VueHook } from "./VueHook";
import { AbstractHook } from "./AbstractHook";
import { MonitorProvider } from "../MonitorProvider";

export type HookType = "aladdin" | "globalError" | "uiEvent" | "uncaught" | "vue";
export class HooksStore {
  private hooks: Map<HookType, AbstractHook> = new Map();

  constructor (_private: MonitorProvider) {
    this.hooks.set("aladdin", new AladdinHook().initlize({private: _private}));
    this.hooks.set("globalError", new GlobalErrorHook().initlize({private: _private}));
    this.hooks.set("uiEvent", new UIEventHook().initlize({private: _private}));
    this.hooks.set("uncaught", new UncaughtHook().initlize({private: _private}));
    this.hooks.set("vue", new VueHook().initlize({private: _private}));
  }

  public watch(type: HookType, options ?: any) {
    let hook = this.hooks.get(type);
    if (hook) {
      if (options) {
        hook.initlize(options);
      }
      hook.watch();
    } 
  }

  public unwatch(type: HookType) {
    let hook = this.hooks.get(type);
    if (hook) {
      hook.unwatch();
    } 
  }
}  