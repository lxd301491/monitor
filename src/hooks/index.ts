import { AladdinHook } from "./AladdinHook";
import { GlobalErrorHook } from "./GlobalErrorHook";
import { UIEventHook } from "./UIEventHook";
import { UncaughtHook } from "./UncaughtHook";
import { VueHook } from "./VueHook";

export enum HOOK_TYPE {
  AladdinHook = "AladdinHook",
  GlobalErrorHook = "GlobalErrorHook",
  UIEventHook = "UIEventHook",
  UncaughtHook = "UncaughtHook",
  VueHook = "VueHook"
}

export { AladdinHook, GlobalErrorHook, UIEventHook, UncaughtHook, VueHook };
