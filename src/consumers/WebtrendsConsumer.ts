import { AbstractConsumer } from "./AbstractConsumer";
import { MonitorCenter } from "../process/MonitorCenter";

declare global {
  interface Window {
    WTjson: any;
  }
}

export class WebtrendsConsumer extends AbstractConsumer {
  _tag: any;

  constructor(center: MonitorCenter, handler: string) {
    super(center, handler);
  }

  initConsume(params: any): void {
    window.WTjson = window.WTjson || {};
    for (let key in params) {
      window.WTjson[key] = params[key];
    }
    this._tag.ready(() => {
      this._tag.init();
    });
    this.center.remandConcurrent();
  }

  clickConsume(params: any): void {
    this._tag.trackEvent(params.otitle, params.olabel, params.opts);
    this.center.remandConcurrent();
  }
}
