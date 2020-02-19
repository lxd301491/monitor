import { CircuitBreaker } from "./tools/CircuitBreaker";
import { EmitType, uploadParams } from "./typings";
import { before, after } from "./decorators/LifeCycle";
import { infoLenMax } from "./configs";
import axios from 'axios';
import qs from 'qs';
import pako from 'pako';

export class MonitorConsumer {
  private api: string;
  private abnormalBreaker: CircuitBreaker = new CircuitBreaker(
    "5/60",
    5 * 60,
    "0/60"
  );
  private emitType: EmitType;
  private func?: (params: uploadParams) => Promise<any>;
  private zip: boolean;

  constructor(api: string, zip: boolean = true, emitType: EmitType = "image", func?: (params: uploadParams) => Promise<any>){
    if (emitType === "custom" && !func) {
      throw Error("When using custom mode, the custom function cannot be empty!");
    }
    if (emitType === "beacon" && !window.navigator.sendBeacon) {
      emitType = "fetch";

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
    let params: uploadParams = {
      data: encodeURIComponent(data)
    }
    if (this.zip && this.emitType != "image" && params.data.length > infoLenMax) {
      console.log(`data length before gzip ${params.data.length}`);
      params.data = pako.gzip(params.data, {to: "string"});
      console.log(`data length after gzip ${params.data.length}`);
      params.zip = true;
    }
    try {
      switch (this.emitType) {
        case "image": {
          await this.imageConsume(params);
          break;
        }
        case "fetch": {
          await this.fetchConsume(params);
          break;
        }
        case "beacon": {
          await this.beaconConsume(params);
          break;
        }
        case "custom": {
          this.func && await this.func(params);
        }
      }
    } catch (err) {
      this.abnormalBreaker.count();
    }
  }

  private imageConsume(params: uploadParams) {
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
      let paramsArr: string[] = []; 
      for (let key in params) {
        paramsArr.push(`${key}=${params[key]}`)
      }
      img.src = this.api + "?" + paramsArr.join("&");
    })
  }
  
  private fetchConsume(params: uploadParams) {
    return axios.post(this.api, qs.stringify(params), {
      headers: {
        'Content-Type':'application/x-www-form-urlencoded'
      }
    })
  }

  private beaconConsume(params: uploadParams) {
    if (!window || !window.navigator || "function" != typeof window.navigator.sendBeacon) {
      return false;
    }
    let paramsForm: FormData = new FormData(); 
    for (let key in params) {
      paramsForm.append(key, params[key]);
    }
    return new Promise((resolve, reject) => {
      window.navigator.sendBeacon(this.api, paramsForm) ? resolve() : reject();
    })
  }
}
