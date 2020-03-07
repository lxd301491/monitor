import { AbstractHook } from "./AbstractHook";
import { MonitorProvider } from "../MonitorProvider";


class actionData<K extends keyof GlobalEventHandlersEventMap>{
  public events: K[] = [];
}

class NodeEventHandlerMap {
  node: Node;
  event: string;
  handler: EventListenerObject;
}

export class ActionHook extends AbstractHook {
  private observer: MutationObserver;
  private handlerMap: NodeEventHandlerMap[] = [];

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
      attributeFilter: ["action-events"]
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
    let attributes = (<Element>node).attributes || [];
    for (let i = 0, len = attributes.length; i < len; ++i) {
      let attr;
      if (attributes instanceof NamedNodeMap) {
        attr = attributes.item(i);
      } else {
        attr = attributes[i];
      }
      if (attr && attr.name === 'action-events') {
        let aData = attr.value.splite(",");
        if (aData instanceof actionData) {
          aData.events.forEach(event => {
            this.watch(node, <keyof GlobalEventHandlersEventMap>event);
          })
        }
      }
    }
  }

  private getCurrentElement(target: HTMLElement) {
    let r = target.outerHTML.match("<.+?>");
    return r && r[0] || "";
  }
  

  private listener<K extends keyof GlobalEventHandlersEventMap>(evt: GlobalEventHandlersEventMap[K]) {
    if (evt instanceof MouseEvent) {
      this.provider.track({
          msg: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : "",
          ms: "action",
          ml: "info",
          at: evt.type,
          el: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : undefined,
          x: evt.x,
          y: evt.y
        });
    } else if (evt instanceof DragEvent) {
      this.provider.track({
        msg: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : "",
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
          msg: `${evt.type}`,
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
        msg: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : "",
        ms: "action",
        ml: "info",
        at: evt.type,
        el: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : undefined,
      });
    } else if (evt instanceof KeyboardEvent) {
      this.provider.track({
        msg: `${evt.type} ${evt.key}`,
        ms: "action",
        ml: "info",
        at: evt.type,
        key: evt.key
      });
    } else if (evt instanceof InputEvent) {
      this.provider.track({
        msg: `${evt.inputType} ${evt.data}`,
        ms: "action",
        ml: "info",
        at: evt.type
      });
    } else {
      this.provider.track({
        msg: `${evt}`,
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
    var handler = new NodeEventHandlerMap();
    handler.node = selector;
    handler.event = event;
    handler.handler = this.listener.bind(this, args);
    this.handlerMap.push(handler);
    selector && selector.addEventListener(event, handler.handler);
  }

  unwatch<K extends keyof GlobalEventHandlersEventMap>(selector: Node, event: K): void {
    for (let i = this.handlerMap.length-1; i>= 0; i--){
      if (this.handlerMap[i].node == selector && this.handlerMap[i].event == event) {
        if (selector) {
          selector.removeEventListener(event, this.handlerMap[i].handler);
        }
        this.handlerMap.splice(i, 1);
      }
    }
  }
}
