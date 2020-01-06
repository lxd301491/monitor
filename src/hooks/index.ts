import { NativeHook } from "./NativeHook";
import { ErrorHook } from "./ErrorHook";
import { ActionHook } from "./ActionHook";
import { UncaughtHook } from "./UncaughtHook";
import { AbstractHook } from "./AbstractHook";
import { SPARouterHook } from "./SPARouterHook";
import { MonitorProvider } from "../MonitorProvider";
import { InfoType } from "../typings";
import { PerformanceHook } from "./PerformanceHook";
import { VueHook } from "./VueHook";

export class HooksStore {
  private hooks: Map<InfoType, AbstractHook> = new Map();

  constructor (provider: MonitorProvider) {
    this.hooks.set("native", new NativeHook(provider));
    this.hooks.set("error", new ErrorHook(provider));
    this.hooks.set("action", new ActionHook(provider));
    this.hooks.set("uncaught", new UncaughtHook(provider));
    this.hooks.set("spa", new SPARouterHook(provider));
    this.hooks.set("performance", new PerformanceHook(provider));
    this.hooks.set("vue", new VueHook(provider));
  }

  public getHooks() {
    return this.hooks;
  }
}  