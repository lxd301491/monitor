import { AladdinHook } from "./AladdinHook";
import { ErrorHook } from "./ErrorHook";
import { ActionHook } from "./ActionHook";
import { UncaughtHook } from "./UncaughtHook";
import { AbstractHook } from "./AbstractHook";
import { SPARouterHook } from "./SPARouterHook";
import { MonitorProvider } from "../MonitorProvider";
import { InfoType } from "../typings";
import { PerformanceHook } from "./PerformanceHook";

export class HooksStore {
  private hooks: Map<InfoType, AbstractHook> = new Map();

  constructor (_private: MonitorProvider) {
    this.hooks.set("native", new AladdinHook(_private).initlize({}));
    this.hooks.set("error", new ErrorHook(_private));
    this.hooks.set("action", new ActionHook(_private));
    this.hooks.set("uncaught", new UncaughtHook(_private));
    this.hooks.set("spa", new SPARouterHook(_private));
    this.hooks.set("performance", new PerformanceHook(_private));
  }

  public watch(type: InfoType, options ?: any) {
    let hook = this.hooks.get(type);
    if (hook) {
      if (hook instanceof AladdinHook) {
        options && hook.initlize(options);
      }
      hook.watch();
    } 
  }

  public unwatch(type: InfoType) {
    let hook = this.hooks.get(type);
    if (hook) {
      hook.unwatch();
    } 
  }
}  