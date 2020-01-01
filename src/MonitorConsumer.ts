import { CircuitBreaker } from "./tools/CircuitBreaker";
import { emitType } from "./typings";
import { Store } from "./Store";
import { before, after } from "./decorators/LifeCycle";
import axios from 'axios';
import { AxiosInstance} from 'axios';
import pako from 'pako';

export class MonitorConsumer {
  private store: Store;
  private api: string;
  private frequencyBreaker: CircuitBreaker = new CircuitBreaker(
    "60/60",
    5 * 60,
    "30/60"
  );
  private abnormalBreaker: CircuitBreaker = new CircuitBreaker(
    "5/60",
    5 * 60,
    "0/60"
  );
  private emitType: emitType;
  private timer?: number;
  private fetch: AxiosInstance; 

  constructor(api: string, store: Store, emitType: emitType = "image", fetch: AxiosInstance = axios) {
    if (emitType === "xhr" && !XMLHttpRequest) {
      throw ReferenceError("EmitType is XHR,but XMLHttpRequest is undefined");
    }
    if (emitType === "fetch" && !fetch) {
      throw ReferenceError("EmitType is FETCH,but fetch object is undefined");
    }
    this.api = api;
    this.store = store;
    this.emitType = emitType;
    this.fetch = fetch;
  }

  mountStore(store: Store) {
    this.store = store;
  }

  setFrequencyBreaker(frequencyBreaker: CircuitBreaker) {
    this.frequencyBreaker = frequencyBreaker;
  }

  setAbnormalBreaker (abnormalBreaker: CircuitBreaker) {
    this.abnormalBreaker = abnormalBreaker;
  }

  start(period: number = 15000, storeParams?: { size?: number, zip?: boolean }) {
    if (this.timer) {
      return;
    }
    this.timer = window.setInterval(async () => {
      let data = await this.store.shiftMore(storeParams && storeParams.size);
      if (data) {
        this.consume(data, storeParams && storeParams.zip);
      }
    }, period);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  @before
  @after
  private async consume(data: string, zip: boolean = false): Promise<any> {
    if (zip) {
      console.log(`data length before gzip ${data.length}`);
      data = encodeURIComponent(data);
      data = pako.gzip(data, {to: "string"});
      console.log(`data length after gzip ${data.length}`);
    }
    this.frequencyBreaker.count();
    try {
      switch (this.emitType) {
        case "image": {
          await this.imageConsume(data);
          break;
        }
        case "xhr": {
          await this.xhrConsume(data);
          break;
        }
        case "fetch": {
          await this.fetchConsume(data);
          break;
        }
      }
    } catch (err) {
      this.abnormalBreaker.count();
    }
  }

  private async imageConsume(data: string) {
    let img = new Image();
    return await new Promise((resolve, reject) => {
      img.onerror = (err) => {
        this.abnormalBreaker.count();
        reject(err);
      };
      img.onload = (resp) => {
        resolve(resp);
      };
      img.onabort = (resp) => {
        reject(resp);
      };
      img.src = this.api + "?data=" + data;
    })
  }

  private async xhrConsume(data: string) {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("POST", this.api, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    return await new Promise((resolve, reject) => {
      xhr.onload = (resp) => {
        resolve(resp);
      };
      xhr.onabort = (resp) => {
        resolve(resp);
      };
      xhr.onerror = (err) => {
        reject(err);
      };
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4 || xhr.status !== 200) {
          reject(xhr.readyState);
        }
      };
      xhr.send(JSON.stringify({
        data: data
      }));
    });
  }

  private async fetchConsume(data: string) {
    if (!this.fetch) {
      return false;
    }
    this.fetch.post(this.api, {
      data: data
    })
  }

  private async beaconConsume(data: string) {
    if (!window || !window.navigator || "function" != typeof window.navigator.sendBeacon) {
      return false;
    }
    window.navigator.sendBeacon(this.api, JSON.stringify({
      data: data
    }));
  }
}
