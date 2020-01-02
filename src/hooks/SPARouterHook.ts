import { AbstractHook } from "./AbstractHook";
import { replace } from "../decorators/LifeCycle";

export class SPARouterHook extends AbstractHook {
  hackOnpopstate() {
    window['_onpopstate_'] = window.onpopstate
    window.onpopstate = function () {
      for (var r = arguments.length, a = new Array(r), o = 0; o < r; o++) a[o] = arguments[o];
      if (window._onpopstate_) return window._onpopstate_.apply(this, a)
    }
  }

  hackState(e: 'pushState' | 'replaceState') {
    replace(history, e, function (data: any, title: string, url?: string | null) {
      // 调用pushState或replaceState时hack Onpopstate
      replace(window, "onpopstate", function (this: Window) {
        for (var r = arguments.length, a = new Array(r), o = 0; o < r; o++) a[o] = arguments[o];
        return  window._replace_center_.onpopstate.apply(this, a);
      });
      let res =  window._replace_center_[e].apply(history, [data, title, url]);
    });
  }
  
  watch(): void {
    this.hackState('pushState')
    this.hackState('replaceState')
  }

  unwatch(): void {
    throw new Error("Method not implemented.");
  }


  
}