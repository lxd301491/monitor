import { AbstractHook } from "./AbstractHook";
import { MonitorProvider } from "../MonitorProvider";
import { before } from "../decorators/LifeCycle";

class ActionEvent {
  event: string;
  msg?: string;
  area?: string;
}

class NodeEventHandlerMap {
  [event: string]: Map<Node, EventListenerObject>
}

export class ActionHook extends AbstractHook {
  private observer: MutationObserver;
  private handlerMap: NodeEventHandlerMap = new NodeEventHandlerMap();

  constructor (provider: MonitorProvider) {
    super(provider);
    this.observer = new MutationObserver((mutations: MutationRecord[], observer: MutationObserver) => {
      mutations.forEach((mutation) => {
        this.nodeBindActionHandler(mutation.target);
      });
    });
    this.observer.observe(window.document, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["jr-event", "jr-msg", "jr-area"]
    });
  }

  /**
   * 遍历当前突变的节点的子节点，所有存在action-data属性的节点挂载对应事件的监听
   * @param node 
   * @param serializer 
   */
  private nodeBindActionHandler(node: Node) {
    node.childNodes && node.childNodes.forEach(node => {
      this.nodeBindActionHandler(node);
    });
    let actionEvents: ActionEvent[] = [];
    let attributes = (<Element>node).attributes || [];
    for (let i = 0, len = attributes.length; i < len; ++i) {
      let attr;
      if (attributes instanceof NamedNodeMap) {
        attr = attributes.item(i);
      } else {
        attr = attributes[i];
      }
      if (attr && attr.name === 'jr-event') {
        let events: string[] = attr.value.split(";");
        events.forEach(value => {
          let actionEvent = new ActionEvent();
          actionEvent.event = value;
          actionEvents.push(actionEvent);
        });
      }
      if (attr && attr.name === 'jr-msg') {
        let msgs: string[] = attr.value.split(";");
        msgs.forEach((value, index) => {
          actionEvents[index].msg = value;
        });
      }
      if (attr && attr.name === 'jr-area') {
        let areas: string[] = attr.value.split(";");
        areas.forEach((value, index) => {
          actionEvents[index].area = value;
        });
      }
    }
    actionEvents.forEach(item => {
      this.watch(node, <keyof GlobalEventHandlersEventMap>item.event, item.msg, item.area);
    })
    
  }

  private getCurrentElement(target: HTMLElement) {
    let r = target.outerHTML.match("<.+?>");
    return r && r[0] || "";
  }
  
  @before
  private actionHandler<K extends keyof GlobalEventHandlersEventMap>(args: any[], evt: GlobalEventHandlersEventMap[K] ) {
    if (evt instanceof MouseEvent) {
      this.provider.track({
          msg: `${args[0]} ${args[1]}`,
          ms: "action",
          ml: "info",
          at: evt.type,
          el: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : undefined,
          x: evt.x,
          y: evt.y
        });
    } else if (evt instanceof DragEvent) {
      this.provider.track({
        msg: `${args[0]} ${args[1]}`,
        ms: "action",
        ml: "info",
        at: evt.type,
        el: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : undefined,
        x: evt.x,
        y: evt.y
      });
    } else if (evt instanceof TouchEvent) {
      for (let len = evt.changedTouches.length, i = 0; i < len; ++i) {
        this.provider.track({
          msg: `${args[0]} ${args[1]}`,
          ms: "action",
          ml: "info",
          at: evt.type,
          el: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : undefined,
          x: evt.changedTouches[i].clientX,
          y: evt.changedTouches[i].clientY,
          c: len > 1 ? i : undefined 
        });
      }
    } else if (evt instanceof FocusEvent) {
      this.provider.track({
        msg: `${args[0]} ${args[1]}`,
        ms: "action",
        ml: "info",
        at: evt.type,
        el: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : undefined,
      });
    } else if (evt instanceof KeyboardEvent) {
      this.provider.track({
        msg: `${args[0]} ${args[1]}`,
        ms: "action",
        ml: "info",
        at: evt.type,
        key: evt.key
      });
    } else if (evt instanceof InputEvent) {
      this.provider.track({
        msg: `${args[0]} ${args[1]}`,
        ms: "action",
        ml: "info",
        at: evt.type
      });
    } else {
      this.provider.track({
        msg: `${args[0]} ${args[1]}`,
        ms: "action",
        ml: "info",
        at: evt.type
      });
    }
  }

  watch<K extends keyof GlobalEventHandlersEventMap>(selector: Node, event: K, ...args: any[]): void {
    if (!selector || !event) {
      throw new Error("[ActionHook.watch] arguments with somethine error, start watch failed");
    }
    if (!this.handlerMap[event]) {
      this.handlerMap[event] = new Map();
    }
    if (this.handlerMap[event].get(selector)) return;
    this.handlerMap[event].set(selector, this.actionHandler.bind(this, args))
    selector && selector.addEventListener(event, this.handlerMap[event].get(selector));
  }

  unwatch<K extends keyof GlobalEventHandlersEventMap>(selector: Node, event: K): void {
    if (this.handlerMap[event] && this.handlerMap[event].get(selector)) {
      selector.removeEventListener(event, this.handlerMap[event].get(selector));
      this.handlerMap[event].delete(selector);
    }
  }
}
