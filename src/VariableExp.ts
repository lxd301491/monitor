export class VariableExp {
  obj: any;

  constructor(obj: any) {
    this.obj = obj;
  }

  async toObj() {
    let target = await VariableExp.toObjStatic(this.obj);
    return target;
  }

  async toString(limit?: number) {
    let target = await VariableExp.toStringStatic(this.obj);
    target = limit ? target.slice(0, limit) : target;
    return target;
  }

  static async toObjStatic(obj: any) {
    let target: any;
    switch (Object.prototype.toString.call(obj)) {
      case "[object Array]":
      case "[object Object]":
      case "[object Number]":
      case "[object Undefined]":
      case "[object Boolean]":
      case "[object String]":
      case "[object Symbol]":
        target = obj;
        break;
      case "[object Promise]":
        target = await obj;
        break;
      case "[object Function]":
        target = obj();
        break;
      default:
        target = obj;
    }
    if (
      ["[object Function]", "[[object Promise]]"].includes(
        Object.prototype.toString.call(target)
      )
    ) {
      target = await VariableExp.toObjStatic(target);
    }
    return target;
  }

  static async toStringStatic(obj: any) {
    let target: string = "";
    let type = Object.prototype.toString.call(obj);
    switch (type) {
      case "[object Array]":
      case "[object Object]":
        target = JSON.stringify(obj);
        break;
      case "[object Number]":
        target = obj.toString();
        break;
      case "[object Undefined]":
        target = "undefined";
        break;
      case "[object Boolean]":
        target = obj ? "1" : "0";
        break;
      case "[object String]":
        target = obj;
        break;
      case "[object Symbol]":
        target = obj.toString();
        break;
      case "[object Promise]":
        target = await obj;
        break;
      case "[object Function]":
        target = obj();
        break;
      default:
        target = "";
    }
    if (Object.prototype.toString.call(target) !== "[object String]") {
      target = await VariableExp.toStringStatic(target);
    }
    return target;
  }
}
