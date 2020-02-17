import { CircuitBreaker } from "./tools/CircuitBreaker";
import { EmitType } from "./typings";
import { before, after } from "./decorators/LifeCycle";
import { infoLenMax } from "./configs";
import axios from 'axios';
import pako from 'pako';

export class MonitorConsumer {
  private api: string;
  private abnormalBreaker: CircuitBreaker = new CircuitBreaker(
    "5/60",
    5 * 60,
    "0/60"
  );
  private emitType: EmitType;
  private func?: (data: string) => Promise<any>;
  private zip: boolean;

  constructor(api: string, zip: boolean = true, emitType: EmitType = "image", func?: (data: string) => Promise<any>){
    if (emitType === "custom" && !func) {
      throw Error("When using custom mode, the custom function cannot be empty!");
    }
    this.api = api;
    this.emitType = emitType;
    this.zip = zip;
    this.func = func;
  }

  public setAbnormalBreaker (abnormalBreaker: CircuitBreaker) {
    this.abnormalBreaker = abnormalBreaker;
  }

  @before
  @after
  public async consume(data: string): Promise<any> {
    if (!this.abnormalBreaker.canPass()) {
      console.log("abnormalBreaker count", this.abnormalBreaker.getCount(), this.abnormalBreaker.getStateName(), "Duration", this.abnormalBreaker.getDuration())
      return;
    }
    data = encodeURIComponent(data);
    if (this.zip && data.length > infoLenMax) {
      console.log(`data length before gzip ${data.length}`);
      data = pako.gzip(data, {to: "string"});
      console.log(`data length after gzip ${data.length}`);
    }
    try {
      switch (this.emitType) {
        case "image": {
          await this.imageConsume(data);
          break;
        }
        case "fetch": {
          await this.fetchConsume(data);
          break;
        }
        case "beacon": {
          await this.beaconConsume(data);
          break;
        }
        case "custom": {
          this.func && await this.func(data);
        }
      }
    } catch (err) {
      this.abnormalBreaker.count();
    }
  }

  private imageConsume(data: string) {
    let img = new Image(1, 1);
    return new Promise((resolve, reject) => {
      img.onerror = (err) => {
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
  
  private fetchConsume(data: string) {
    return axios.post(this.api, {
      data: data
    }, {
      headers: {
        'Content-Type':'application/x-www-form-urlencoded'
      }
    })
  }

  private beaconConsume(data: string) {
    if (!window || !window.navigator || "function" != typeof window.navigator.sendBeacon) {
      return false;
    }
    return new Promise((resolve, reject) => {
      window.navigator.sendBeacon(this.api, JSON.stringify({
        data: data
      })) ? resolve() : reject();
    })
  }
}
