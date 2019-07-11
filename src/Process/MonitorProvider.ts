import { AbstractConsumer } from './AbstractConsumer';

export class MonitorProvider {
  consumer: AbstractConsumer;
  oAttrs: object[] = [];
  pauseKeys: string[] = [];
  eAttrs: object[] = [];
  isRunning: boolean = false;

  mergeOriginalAttributes (attrs, limits, replace = false) {
    let _attrs = {};
    for (let key in attrs) {
      _attrs[key] = new VariableExp(attrs[key], limits && limits[key]);
    }
    if (replace) {
      this.oAttrs = _attrs;
    } else {
      this.oAttrs = {
        ...this.oAttrs,
        ..._attrs
      };
    }

    return this;
  }

  pauseOriginalAttributes (keys) {
    this.pauseKeys = keys;
    return this;
  }

  continueOriginalAttributes (keys) {
    this.pauseKeys = this.pauseKeys.filter(item => {
      return !keys.includes(item);
    });
    return this;
  }

  removeOriginalAttributes (keys) {
    if (Object.prototype.toString.call(keys) === '[object Array]') {
      keys.forEach(key => {
        delete this.oAttrs[key];
      });
    } else {
      delete this.oAttrs[keys];
    }
    return this;
  }

  start () {
    this.isRunning = true;
  }

  pause () {
    this.isRunning = false;
  }

  mounte (consumer) {
    if (!(consumer && consumer instanceof AbstractConsumer)) {
      console.log('[MonitorProducer::mounte] mounte consumer failed, the type of consumer is not AbstractConsumer');
      return this;
    }
    this.consumer = consumer;
    this.consumer.mounted(this);
    return this;
  }

  unmounte (consumer) {
    if (this.consumer === consumer) {
      this.consumer = null;
      consumer.unmounted();
    }
    return this;
  }

  notify () {
    if (!this.consumer) return;
    while (this.eAttrs.length > 0) {
      this.consumer.consume();
    }
  }

  push (params, limits) {
    let _attrs = {};
    for (let key in params) {
      _attrs[key] = new VariableExp(params[key], limits && limits[key]);
    }
    this.eAttrs.push(_attrs);
    this.notify();
  }
}