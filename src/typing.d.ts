interface Navigator {
  connection: any;
}

interface Window {
  attachEvent<K extends keyof WindowEventMap>(event: string, listener: (evt: WindowEventMap[K]) => void) : void;
  detachEvent<K extends keyof WindowEventMap>(event: string, listener: (evt: WindowEventMap[K]) => void) : void;
  _replace_center_: any;
  XMLHttpRequest: any;
  _onpopstate_: any;
  WTjson: any;
  _tag: any;
}

interface HTMLStyleElement {
  styleSheet: {
    cssText: string
  }
}

interface ILiftCycle {
  [key: string]: any,
  consume: {
    before: Function,
    after: Function,
  },
  track: {
    before: Function,
    after: Function,
  }
}

interface Date {
  toGMTString(): string;
}

interface InputEvent extends UIEvent {
  readonly data: string | null;
  readonly inputType: string;
  readonly isComposing: boolean;
}

declare var InputEvent: {
  prototype: InputEvent;
  new(type: string, eventInitDict?: InputEventInit): InputEvent;
};

interface WindowEventMap {
  "historystatechanged": CustomEvent
}