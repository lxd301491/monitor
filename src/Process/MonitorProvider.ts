import { AbstractConsumer } from './AbstractConsumer';
import { VariableExp } from './VariableExp';
import { MonitorCenter } from './MonitorCenter';

export class MonitorProvider {
  handler: string = Math.random().toString(36).substring(2);
  /**
   * 静态数据，添加后每个生成的埋点都会携带，除非主动发生改变
   */
  eternals: object = {};
  storage: any;
  length: number = 10;
  center: MonitorCenter | undefined;

  constructor (storage: any, length: number) {
    if (typeof storage.setItem === 'function' && typeof storage.getItem === 'function') {
      this.storage = storage;
    }
    this.length = length || 0;
  }

  async mergeEternals (obj: object) {
    let tempObj = {};
    for (const key: (keyof any) in obj) {
      tempObj[key] = await VariableExp.toStringStatic(obj[key]);
    }
    
  }

  mounte (center: MonitorCenter): string {
    if (!center) {
      this.center = center;
    }
    return this.handler;
  }

  push(params: object | Promise<object> | Function) {

  }
}