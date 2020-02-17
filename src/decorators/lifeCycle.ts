export const lifeCycle: ILiftCycle = {
  consume: {
    before: () => {},
    after: () => {}
  },
  track: {
    before: () => {},
    after: () => {}
  }
}

export function before(target: Object, methodName: string, descriptor: PropertyDescriptor) {
  return {
    value: function(...args: any[]) {
      lifeCycle[methodName] && lifeCycle[methodName].before.apply(this, args);
      return descriptor.value.apply(this, args);
    }
  }
}

export function after(target: Object, methodName: string, descriptor: PropertyDescriptor) {
  return {
    value: async function(...args: any[]) {
      let result = await descriptor.value.apply(this, args);
      lifeCycle[methodName] && lifeCycle[methodName].after.apply(this, [result]);
      return result;
    }
  }
}

export function replace(target: any, methodName: string, replacer: Function, namespace?: string) {
  let top: any = window || global || undefined;
  if (!top) {
    throw new ReferenceError("the top object is not exist");
  } 
  if (!top._replace_center_) top._replace_center_ = {};
  let container = namespace ? top._replace_center_[namespace] ? top._replace_center_[namespace] : top._replace_center_[namespace] = {} : top._replace_center_;
  if (!container[methodName]) {
    container[methodName] = target[methodName];
    target[methodName] = replacer;
  }
}

export function reduction(target: any, methodName: string, namespace?: string) {
  let top: any = window || global || undefined;
  if (!top) {
    throw new ReferenceError("the top object is not exist");
  } 
  if (!top._replace_center_) top._replace_center_ = {};
  let container = namespace ? top._replace_center_[namespace] ? top._replace_center_[namespace] : top._replace_center_[namespace] = {} : top._replace_center_;
  if (top._replace_center_[methodName]) {
    target[methodName] = container[methodName];
    delete container[methodName];
  }
}
