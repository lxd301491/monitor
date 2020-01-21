import { globalConfig } from "../configs";

export function Logger(target: Object, key: string, value: any) {
  /function\s+(.*)\s*\(/.exec(target.constructor.toString());
  let className: string = RegExp.$1;
  /function.*?\((.*)\)/.exec(value.value.toString());
  let argsName: string[] = RegExp.$1.split(",");
  return {
    value: function(...args: any[]) {
      var result = value.value.apply(this, args);
      if (globalConfig.debug) {
        if (result instanceof Promise) {
          result
          .then((resp) => {
            console.group(`${className} ${key} success`);
            console.log(`args: ${JSON.stringify(argsName)}`);
            console.log(`argsValue: ${JSON.stringify(args)}`);
            console.log(`result: ${JSON.stringify(resp)}`);
            console.groupEnd();
          })
          .catch(err => {
            console.group(`${className} ${key} failed`);
            console.log(`args: ${JSON.stringify(argsName)}`);
            console.log(`argsValue: ${JSON.stringify(args)}`);
            console.log(`result: ${JSON.stringify(err)}`);
            console.groupEnd();
          })
        } else {
          console.group(`${className} ${key} success`);
          console.log(`args: ${JSON.stringify(argsName)}`);
          console.log(`argsValue: ${JSON.stringify(args)}`);
          console.log(`result: ${JSON.stringify(result)}`);
          console.groupEnd();
        }
      }
      return result;
    }
  };
}