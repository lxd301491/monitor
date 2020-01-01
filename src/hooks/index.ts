import { AladdinHook } from "./AladdinHook";
import { ErrorHook } from "./ErrorHook";
import { ActionHook } from "./ActionHook";
import { UncaughtHook } from "./UncaughtHook";
import { VueHook } from "./VueHook";
import { AbstractHook } from "./AbstractHook";
import { MonitorProvider } from "../MonitorProvider";
import { InfoType } from "../typings";

export class HooksStore {
  private hooks: Map<InfoType, AbstractHook> = new Map();

  constructor (_private: MonitorProvider) {
    this.hooks.set("native", new AladdinHook().initlize({private: _private}));
    this.hooks.set("error", new ErrorHook().initlize({private: _private}));
    this.hooks.set("action", new ActionHook().initlize({private: _private}));
    this.hooks.set("uncaught", new UncaughtHook().initlize({private: _private}));
    this.hooks.set("vue", new VueHook().initlize({private: _private}));
  }

  public watch(type: InfoType, options ?: any) {
    let hook = this.hooks.get(type);
    if (hook) {
      if (options) {
        hook.initlize(options);
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